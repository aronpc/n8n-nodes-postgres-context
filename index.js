// This file is the entry point for n8n
// It exports the node types from the compiled dist directory

const { nodeTypes } = require('./dist/index');

module.exports = {
  nodeTypes,
};
