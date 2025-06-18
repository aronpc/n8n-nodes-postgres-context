import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { CONTEXT_TYPES, getContextsByType } from '../../utils/database';

export class ContextManagerNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AI Context Manager',
		name: 'contextManager',
		icon: 'file:contextManager.svg',
		group: ['transform'],
		version: 1,
		description: 'Retrieve AI context by type with filtering and limits',
		defaults: {
			name: 'Context Manager',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Chat ID',
				name: 'chatId',
				type: 'string',
				default: '',
				required: true,
				description: 'Unique identifier for the conversation',
			},
			{
				displayName: 'Always Include Context Types',
				name: 'alwaysInclude',
				type: 'multiOptions',
				options: CONTEXT_TYPES.map((type) => ({ name: type, value: type })),
				default: [],
				description: 'Context types that should always be included',
			},
			{
				displayName: 'Limits Per Type',
				name: 'limitsPerType',
				placeholder: 'Add Limit',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'limits',
						displayName: 'Limit',
						values: [
							{
								displayName: 'Context Type',
								name: 'type',
								type: 'options',
								options: CONTEXT_TYPES.map((type) => ({ name: type, value: type })),
								default: '',
								description: 'Type of context to limit',
							},
							{
								displayName: 'Limit',
								name: 'limit',
								type: 'number',
								typeOptions: {
									minValue: 1,
								},
								default: 50,
								description: 'Max number of results to return',
							},
						],
					},
				],
			},
			{
				displayName: 'PostgreSQL Connection String',
				name: 'connectionString',
				type: 'string',
				default: '',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// Get parameters
				const chatId = this.getNodeParameter('chatId', i) as string;
				const alwaysInclude = this.getNodeParameter('alwaysInclude', i) as string[];
				const limitsPerTypeCollection = this.getNodeParameter('limitsPerType', i) as {
					limits?: Array<{ type: string; limit: number }>;
				};
				const connectionString = this.getNodeParameter('connectionString', i) as string;

				// Convert the limits collection to the expected format
				const limitsPerType = limitsPerTypeCollection.limits || [];

				// Get contexts by type
				const contexts = await getContextsByType(
					connectionString,
					chatId,
					alwaysInclude,
					limitsPerType,
				);

				// Return the contexts
				returnData.push({
					json: {
						success: true,
						contexts,
					},
				});
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
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : String(error),
				);
			}
		}

		return [returnData];
	}
}
