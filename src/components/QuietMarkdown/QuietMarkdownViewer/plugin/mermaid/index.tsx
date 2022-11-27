import React from 'react';

import { visit } from 'unist-util-visit';
import { hasProperty } from 'hast-util-has-property';
import MermaidBlock from './MermaidBlock';

export default function rehypeMermaid() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (hasProperty(node, 'className')) {
        if (node.properties.className.indexOf('language-mermaid') !== -1) {
          const text = node.children[0].value;
          parent.children[index] = {
            type: 'element',
            tagName: 'div',
            properties: {
              children: <MermaidBlock code={text} />,
            },
            children: [],
          };
        }
      }
    });
  };
}
