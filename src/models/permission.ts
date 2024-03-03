import { treePermission as getTreePermissions } from '@/services/quiet/permissionController';
import _ from 'lodash';
import { useEffect, useState } from 'react';
export default function Role() {
  const [treePermissionData, setTreePermissionData] = useState<API.TreePermission[]>([]);

  useEffect(() => {
    getTreePermissions().then((resp) => setTreePermissionData(resp));
  }, []);

  const treePermissions = () => _.cloneDeep(treePermissionData);

  return { treePermissions };
}
