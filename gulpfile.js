const { src, dest } = require('gulp');
const path = require('path');

/**
 * Copies the icons to the dist folder
 */
function buildIcons() {
  const nodeTypes = [
    'ContextManager',
    'ExternalContext',
  ];

  const iconPromises = [];

  // Loop over all node types and copy their icons
  for (const nodeType of nodeTypes) {
    const dirPath = path.resolve('src', 'nodes', nodeType);
    const iconPromise = src(path.resolve(dirPath, '*.svg'))
      .pipe(dest(path.resolve('dist', 'nodes', nodeType)));
    iconPromises.push(iconPromise);
  }

  return Promise.all(iconPromises);
}

exports['build:icons'] = buildIcons;
