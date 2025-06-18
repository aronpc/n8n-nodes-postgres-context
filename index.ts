import { INodeTypeDescription } from 'n8n-workflow';
import { ContextManagerNode } from './nodes/ContextManager/ContextManager.node';
import { ExternalContextNode } from './nodes/ExternalContext/ExternalContext.node';

// Export the nodes
export class NodesPostgresContext {

  static getNodeTypes(): object[] {
    return [
      new ContextManagerNode(),
      new ExternalContextNode(),
    ];
  }

  static getNodeTypeDescription(): INodeTypeDescription[] {
    return [
      new ContextManagerNode().description,
      new ExternalContextNode().description,
    ];
  }
}

// This is the entry point for n8n to register the nodes
export const nodeTypes = NodesPostgresContext.getNodeTypes();
