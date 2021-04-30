export function iterationsAddToChildren(
  pvs: ScrumEntities.ScrumVersion[],
): ScrumEntities.ScrumVersion[] {
  return pvs.map((pv) => {
    const newPv = pv;
    if (newPv.children && newPv.children.length > 0) {
      iterationsAddToChildren(newPv.children);
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
