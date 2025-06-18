import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

import { CONTEXT_TYPES, saveContext, getContext } from '../../utils/database';

export class ExternalContextNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AI External Context',
    name: 'externalContext',
    icon: 'file:externalContext.svg',
    group: ['transform'],
    version: 1,
    description: 'Save or retrieve external AI contexts',
    defaults: {
      name: 'External Context',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation Mode',
        name: 'mode',
        type: 'options',
        options: [
          {
            name: 'Save Context',
            value: 'save',
          },
          {
            name: 'Get Context',
            value: 'get',
          },
        ],
        default: 'save',
        description: 'Whether to save or retrieve a context',
      },
      {
        displayName: 'Chat ID',
        name: 'chatId',
        type: 'string',
        default: '',
        required: true,
        description: 'Unique identifier for the conversation',
      },
      {
        displayName: 'Context Key',
        name: 'contextKey',
        type: 'string',
        default: '',
        required: true,
        description: 'Name of the context key',
      },
      {
        displayName: 'Context Type',
        name: 'contextType',
        type: 'options',
        options: CONTEXT_TYPES.map(type => ({ name: type, value: type })),
        default: 'api',
        description: 'Type of the context',
      },
      {
        displayName: 'Context Value',
        name: 'contextValue',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: {
            mode: ['save'],
          },
        },
        description: 'JSON object to be saved as context',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
          show: {
            mode: ['save'],
          },
        },
        description: 'Optional user identifier',
      },
      {
        displayName: 'Agent ID',
        name: 'agentId',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
          show: {
            mode: ['save'],
          },
        },
        description: 'Optional agent identifier',
      },
      {
        displayName: 'Session Key',
        name: 'sessionKey',
        type: 'string',
        default: 'default',
        required: false,
        displayOptions: {
          show: {
            mode: ['save'],
          },
        },
        description: 'Session identifier',
      },
      {
        displayName: 'PostgreSQL Connection String',
        name: 'connectionString',
        type: 'string',
        default: '',
        required: true,
        description: 'PostgreSQL connection string',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // Get common parameters
        const mode = this.getNodeParameter('mode', i) as string;
        const chatId = this.getNodeParameter('chatId', i) as string;
        const contextKey = this.getNodeParameter('contextKey', i) as string;
        const contextType = this.getNodeParameter('contextType', i) as string;
        const connectionString = this.getNodeParameter('connectionString', i) as string;

        if (mode === 'save') {
          // Get save-specific parameters
          const contextValueJson = this.getNodeParameter('contextValue', i) as string;
          const contextValue = JSON.parse(contextValueJson);
          const userId = this.getNodeParameter('userId', i, '') as string;
          const agentId = this.getNodeParameter('agentId', i, '') as string;
          const sessionKey = this.getNodeParameter('sessionKey', i, 'default') as string;

          // Save the context
          await saveContext(
            connectionString,
            chatId,
            contextKey,
            contextType,
            contextValue,
            userId,
            agentId,
            sessionKey
          );

          // Return success
          returnData.push({
            json: {
              success: true,
              operation: 'save',
              chatId,
              contextKey,
              contextType,
            },
          });
        } else if (mode === 'get') {
          // Get the context
          const context = await getContext(
            connectionString,
            chatId,
            contextKey,
            contextType
          );

          // Return the context or null if not found
          returnData.push({
            json: {
              success: true,
              operation: 'get',
              chatId,
              contextKey,
              contextType,
              context,
            },
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              success: false,
              error: error instanceof Error ? error.message : String(error),
            },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error instanceof Error ? error : String(error));
      }
    }

    return [returnData];
  }
}
