import { ensureAiContextsTable, saveContext, getContext, getContextsByType } from '../src/utils/database';

// Replace with your actual PostgreSQL connection string
const connectionString = 'postgresql://username:password@localhost:5432/database';

// Test chat ID
const chatId = 'test-chat-' + Date.now();

async function runTests() {
  try {
    console.log('Testing database utilities...');

    // Test table creation
    console.log('Testing table creation...');
    await ensureAiContextsTable(connectionString);
    console.log('✅ Table creation successful');

    // Test saving context
    console.log('Testing context saving...');
    await saveContext(
      connectionString,
      chatId,
      'test-key',
      'api',
      { data: 'test data' },
      'test-user',
      'test-agent',
      'test-session'
    );
    console.log('✅ Context saving successful');

    // Test retrieving context
    console.log('Testing context retrieval...');
    const context = await getContext(
      connectionString,
      chatId,
      'test-key',
      'api'
    );
    console.log('Retrieved context:', context);

    if (context && context.context_value && context.context_value.data === 'test data') {
      console.log('✅ Context retrieval successful');
    } else {
      console.error('❌ Context retrieval failed');
    }

    // Test retrieving contexts by type
    console.log('Testing contexts retrieval by type...');

    // Save another context for testing
    await saveContext(
      connectionString,
      chatId,
      'test-key-2',
      'user',
      { data: 'user data' }
    );

    const contexts = await getContextsByType(
      connectionString,
      chatId,
      ['api'],
      [{ type: 'user', limit: 5 }]
    );

    console.log('Retrieved contexts:', contexts);

    if (contexts && contexts.length >= 2) {
      console.log('✅ Contexts retrieval by type successful');
    } else {
      console.error('❌ Contexts retrieval by type failed');
    }

    console.log('All tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests().catch(console.error);

/*
To run this test:
1. Update the connectionString with your PostgreSQL connection details
2. Run: npx ts-node tests/database.test.ts
*/
