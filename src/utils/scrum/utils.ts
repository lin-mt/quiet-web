export function iterationsAddToChildren(
  pvs: ScrumEntities.ScrumVersion[],
): ScrumEntities.ScrumVersion[] {
  return pvs.map((pv) => {
    const newPv = pv;
    if (newPv.children && newPv.children.length > 0) {
      newPv.children = iterationsAddToChildren(newPv.children);
    }
    if (newPv.iterations && newPv.iterations.length > 0) {
      if (!newPv.children) {
        newPv.children = [];
      }
      newPv.children = newPv.children.concat(newPv.iterations);
    }
    return newPv;
  });
}

export function disableTreeNode(nodes: ScrumEntities.ScrumVersion[]): ScrumEntities.ScrumVersion[] {
  const newNodes: ScrumEntities.ScrumVersion[] = [];
  nodes.forEach((val) => newNodes.push({ ...val }));
  return newNodes.map((node) => {
    const newNode = node;
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = disableTreeNode(newNode.children);
    }
    if (!newNode.versionId) {
      newNode.disabled = true;
    }
    return newNode;
  });
}
