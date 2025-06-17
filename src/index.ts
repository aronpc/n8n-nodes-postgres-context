import { INodeTypeData } from 'n8n-workflow';

import { ContextManagerNode } from './nodes/ContextManager/ContextManager.node';
import { ExternalContextNode } from './nodes/ExternalContext/ExternalContext.node';

export const nodeTypes: INodeTypeData = {
  ContextManagerNode: {
    type: new ContextManagerNode(),
    sourcePath: __dirname + '/nodes/ContextManager/ContextManager.node.js',
  },
  ExternalContextNode: {
    type: new ExternalContextNode(),
    sourcePath: __dirname + '/nodes/ExternalContext/ExternalContext.node.js',
  },
};
