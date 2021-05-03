import type { ScrumVersion } from '@/services/scrum/EntitiyType';

export function iterationsAddToChildren(scrumVersions: ScrumVersion[]): ScrumVersion[] {
  return scrumVersions.map((sv) => {
    const newSv: any = sv;
    if (newSv.children && newSv.children.length > 0) {
      newSv.children = iterationsAddToChildren(newSv.children);
    }
    if (newSv.iterations && newSv.iterations.length > 0) {
      if (!newSv.children) {
        newSv.children = [];
      }
      newSv.children = newSv.children.concat(newSv.iterations);
    }
    return newSv;
  });
}

export function disableTreeNode(nodes: ScrumVersion[]): ScrumVersion[] {
  const newNodes: any[] = [];
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
