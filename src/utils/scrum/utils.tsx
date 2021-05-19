import type { ScrumIteration, ScrumVersion } from '@/services/scrum/EntitiyType';
import { FileOutlined } from '@ant-design/icons';

export function iterationsAddToChildren(scrumVersions: ScrumVersion[]): ScrumVersion[] {
  const newNodes: ScrumVersion[] = [];
  scrumVersions.forEach((val) => newNodes.push({ ...val }));
  return newNodes.map((sv) => {
    const newSv: any = sv;
    if (newSv.children && newSv.children.length > 0) {
      newSv.children = iterationsAddToChildren(newSv.children);
    }
    if (newSv.iterations && newSv.iterations.length > 0) {
      const newIterations: any[] = [];
      newSv.iterations.forEach((iteration: any) => {
        const newIteration = { ...iteration };
        newIteration.icon = <FileOutlined />;
        newIterations.push(newIteration);
      });
      newSv.iterations = newIterations;
      if (!newSv.children) {
        newSv.children = [];
      }
      newSv.children = newSv.children.concat(newSv.iterations);
    }
    return newSv;
  });
}

export function disableVersionNode(nodes: ScrumVersion[]): ScrumVersion[] {
  const newNodes: any[] = [];
  nodes.forEach((val) => newNodes.push({ ...val }));
  return newNodes.map((node) => {
    const newNode = node;
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = disableVersionNode(newNode.children);
    }
    if (!newNode.versionId) {
      newNode.disabled = true;
    }
    return newNode;
  });
}

export function getIterationInfo(
  nodes: ScrumVersion[],
  iterationId: string,
): ScrumIteration | undefined {
  let iterationInfo: ScrumIteration | undefined;
  nodes.every((node) => {
    if (node.iterations) {
      node.iterations.every((iteration) => {
        if (iteration.id === iterationId) {
          iterationInfo = iteration;
          return false;
        }
        return true;
      });
    }
    if (iterationInfo) {
      return false;
    }
    if (node.children) {
      iterationInfo = getIterationInfo(node.children, iterationId);
    }
    return !iterationInfo;
  });
  return iterationInfo;
}
