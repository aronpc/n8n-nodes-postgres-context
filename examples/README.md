# n8n-nodes-postgres-context Examples

This directory contains example workflows for the n8n-nodes-postgres-context package.

## Prerequisites

Before using these examples, make sure you have:

1. Installed the n8n-nodes-postgres-context package in your n8n instance
2. Set up a PostgreSQL database with the required table structure (see the main README.md)

## Examples

### Context Manager Example

The `ContextManager_Example.json` workflow demonstrates how to use the Context Manager node to retrieve contexts by type with filtering and limits.

To use this example:

1. Import the workflow into your n8n instance
2. Update the PostgreSQL connection string with your database credentials
3. Run the workflow

The workflow will retrieve contexts for the specified chat ID, always including the "api" context type and limiting the number of "user" and "agent" contexts.

### External Context Save Example

The `ExternalContext_Save_Example.json` workflow demonstrates how to use the External Context node to save a context.

To use this example:

1. Import the workflow into your n8n instance
2. Update the PostgreSQL connection string with your database credentials
3. Run the workflow

The workflow will save a weather forecast context for Arraial do Cabo with the specified chat ID, user ID, agent ID, and session key.

### External Context Get Example

The `ExternalContext_Get_Example.json` workflow demonstrates how to use the External Context node to retrieve a context.

To use this example:

1. Import the workflow into your n8n instance
2. Update the PostgreSQL connection string with your database credentials
3. Run the workflow

The workflow will retrieve the weather forecast context for the specified chat ID.

## Importing Workflows

To import a workflow into n8n:

1. Go to the Workflows page in your n8n instance
2. Click the "Import from File" button
3. Select the JSON file for the example workflow
4. Click "Import"

## Customizing Examples

Feel free to customize these examples to fit your specific use case:

- Change the chat ID, context key, context type, etc.
- Add additional nodes to process the context data
- Combine multiple nodes to create more complex workflows

## Additional Resources

For more information about the n8n-nodes-postgres-context package, see the main README.md file.
