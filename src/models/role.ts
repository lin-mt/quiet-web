import { treeRoles as getTreeRoles } from '@/services/quiet/roleController';
import _ from 'lodash';
import { useEffect, useState } from 'react';
export default function Role() {
  const [treeRoleData, setTreeRoleData] = useState<API.TreeRole[]>([]);

  useEffect(() => {
    getTreeRoles().then((resp) => setTreeRoleData(resp));
  }, []);

  const treeRoles = () => _.cloneDeep(treeRoleData);

  return { treeRoles };
}
