import { Pool, PoolClient } from 'pg';

// Context types as defined in the requirements
export const CONTEXT_TYPES = [
  'user', 'agent', 'api', 'memory', 'short_term', 'long_term', 'system', 'custom'
];

// Function to ensure the AI contexts table exists
export async function ensureAiContextsTable(connectionString: string): Promise<void> {
  const pool = new Pool({ connectionString });
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();

    // Create the table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_contexts (
        id SERIAL PRIMARY KEY,
        chat_id TEXT NOT NULL,
        user_id TEXT,
        agent_id TEXT,
        session_key TEXT NOT NULL,
        context_key TEXT NOT NULL,
        context_type TEXT DEFAULT 'session',
        context_value JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (chat_id, context_key, context_type)
      );
    `);

    // Create the index if it doesn't exist
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_context_chat_type ON ai_contexts (chat_id, context_type, updated_at DESC);
    `);

  } catch (error) {
    console.error('Error ensuring AI contexts table exists:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Function to get contexts by type with limits
export async function getContextsByType(
  connectionString: string,
  chatId: string,
  alwaysIncludeTypes: string[] = [],
  limitsPerType: Array<{ type: string; limit: number }> = []
): Promise<any[]> {
  const pool = new Pool({ connectionString });
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();

    // Ensure the table exists
    await ensureAiContextsTable(connectionString);

    // Build a query to get all contexts that match the criteria
    let contexts: any[] = [];

    // First, get all contexts of types that should always be included
    if (alwaysIncludeTypes.length > 0) {
      const alwaysIncludeResult = await client.query(
        `SELECT * FROM ai_contexts 
         WHERE chat_id = $1 AND context_type = ANY($2)
         ORDER BY updated_at DESC`,
        [chatId, alwaysIncludeTypes]
      );

      contexts = [...alwaysIncludeResult.rows];
    }

    // Then, get contexts with limits per type
    for (const { type, limit } of limitsPerType) {
      // Skip types that are already included in alwaysIncludeTypes
      if (alwaysIncludeTypes.includes(type)) continue;

      const limitedResult = await client.query(
        `SELECT * FROM ai_contexts 
         WHERE chat_id = $1 AND context_type = $2
         ORDER BY updated_at DESC
         LIMIT $3`,
        [chatId, type, limit]
      );

      contexts = [...contexts, ...limitedResult.rows];
    }

    // Sort all contexts by updated_at DESC
    contexts.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return contexts;
  } catch (error) {
    console.error('Error getting contexts by type:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Function to save or update a context
export async function saveContext(
  connectionString: string,
  chatId: string,
  contextKey: string,
  contextType: string,
  contextValue: any,
  userId?: string,
  agentId?: string,
  sessionKey: string = 'default'
): Promise<void> {
  const pool = new Pool({ connectionString });
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();

    // Ensure the table exists
    await ensureAiContextsTable(connectionString);

    // Insert or update the context
    await client.query(
      `INSERT INTO ai_contexts 
       (chat_id, user_id, agent_id, session_key, context_key, context_type, context_value, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (chat_id, context_key, context_type)
       DO UPDATE SET 
         context_value = $7,
         updated_at = NOW(),
         user_id = COALESCE($2, ai_contexts.user_id),
         agent_id = COALESCE($3, ai_contexts.agent_id),
         session_key = COALESCE($4, ai_contexts.session_key)`,
      [chatId, userId, agentId, sessionKey, contextKey, contextType, contextValue]
    );
  } catch (error) {
    console.error('Error saving context:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Function to get a specific context
export async function getContext(
  connectionString: string,
  chatId: string,
  contextKey: string,
  contextType: string
): Promise<any | null> {
  const pool = new Pool({ connectionString });
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();

    // Ensure the table exists
    await ensureAiContextsTable(connectionString);

    // Get the context
    const result = await client.query(
      `SELECT * FROM ai_contexts 
       WHERE chat_id = $1 AND context_key = $2 AND context_type = $3
       LIMIT 1`,
      [chatId, contextKey, contextType]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error getting context:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}
