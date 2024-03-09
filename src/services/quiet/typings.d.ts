declare namespace API {
  type AddPermission = {
    /** 排序值 */
    ordinal?: number;
    parentId?: string;
    /** 权限名称 */
    name: string;
    /** 权限类型 */
    type: 'MENU' | 'BUTTON' | 'API';
    /** 路径 */
    path: string;
    /** 值 */
    value: string;
    /** 请求地址 */
    httpUrl?: string;
    /** 请求方法 */
    httpMethod?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 备注信息 */
    remark?: string;
  };

  type AddProject = {
    /** 项目名称 */
    name: string;
    templateId: string;
    projectGroupId: string;
    /** 构建工具 */
    buildTool: 'MAVEN' | 'GRADLE';
    /** git地址 */
    gitAddress: string;
    /** 项目描述 */
    description?: string;
  };

  type AddProjectGroup = {
    /** 项目组名称 */
    name: string;
    /** 项目组描述 */
    description?: string;
  };

  type AddRequirementPriority = {
    /** 优先级名称 */
    name: string;
    /** 卡片颜色 */
    color: string;
    /** 优先级描述 */
    description?: string;
  };

  type AddRole = {
    /** 排序值 */
    ordinal?: number;
    parentId?: string;
    /** 角色名称 */
    name: string;
    /** 角色值 */
    value: string;
    /** 角色编码 */
    code: string;
  };

  type AddTaskStep = {
    /** 步骤名称 */
    name: string;
    /** 步骤描述 */
    description?: string;
  };

  type AddTemplate = {
    /** 模板名称 */
    name: string;
    /** 模板描述 */
    description?: string;
    /** 任务步骤 */
    taskSteps: AddTaskStep[];
    /** 需求优先级 */
    requirementPriorities: AddRequirementPriority[];
  };

  type CurrentUser = {
    id?: string;
    /** 用户名称 */
    username: string;
    permission?: UserPermission;
    /** 用户拥有的角色信息 */
    roles?: RoleInfo[];
  };

  type deletePermissionParams = {
    /** 权限ID */
    id: string;
  };

  type deleteProjectGroupParams = {
    id: string;
  };

  type deleteProjectParams = {
    id: string;
  };

  type deleteRoleParams = {
    /** 角色ID */
    id: string;
  };

  type deleteUserParams = {
    /** 用户ID */
    id: string;
  };

  type getProjectDetailParams = {
    id: string;
  };

  type getProjectGroupDetailParams = {
    id: string;
  };

  type getTemplateDetailParams = {
    id: string;
  };

  type listPermissionParams = {
    /** 角色ID */
    roleId: string;
  };

  type listRolesParams = {
    /** 用户ID */
    userId: string;
  };

  type listUserParams = {
    /** 用户名 */
    username: string;
  };

  type Member = {
    id: string;
    /** 用户名 */
    username: string;
  };

  type PageableObject = {
    offset?: number;
    sort?: SortObject;
    pageNumber?: number;
    pageSize?: number;
    paged?: boolean;
    unpaged?: boolean;
  };

  type PagePermission = {
    /** 页数 */
    current?: number;
    /** 分页大小 */
    pageSize?: number;
    id?: string;
    /** 权限名称 */
    name?: string;
    /** 权限值 */
    value?: string;
    parentId?: string;
    /** 权限类型 */
    type?: 'MENU' | 'BUTTON' | 'API';
    /** 请求URL */
    httpUrl?: string;
    /** 请求方法 */
    httpMethod?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 备注 */
    remark?: string;
  };

  type pagePermissionParams = {
    pagePermission: PagePermission;
  };

  type PagePermissionVO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: PermissionVO[];
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type PageProjectFilter = {
    /** 页数 */
    current?: number;
    /** 分页大小 */
    pageSize?: number;
    id?: string;
    /** 项目名称 */
    name?: string;
    /** 构建工具 */
    buildTool?: 'MAVEN' | 'GRADLE';
    /** git地址 */
    gitAddress?: string;
    /** 项目描述 */
    description?: string;
  };

  type PageProjectGroup = {
    /** 页数 */
    current?: number;
    /** 分页大小 */
    pageSize?: number;
    id?: string;
    /** 项目组名称 */
    name?: string;
    /** 项目组描述 */
    description?: string;
  };

  type pageProjectGroupParams = {
    page: PageProjectGroup;
  };

  type PageProjectGroupVO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: ProjectGroupVO[];
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type pageProjectParams = {
    pageProjectFilter: PageProjectFilter;
  };

  type PageProjectVO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: ProjectVO[];
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type PageRole = {
    /** 页数 */
    current?: number;
    /** 分页大小 */
    pageSize?: number;
    id?: string;
    /** 角色名称 */
    name?: string;
    /** 角色值 */
    value?: string;
    /** 角色编码 */
    code?: string;
    parentId?: string;
  };

  type pageRoleParams = {
    pageRole: PageRole;
  };

  type PageRoleVO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: RoleVO[];
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type PageUser = {
    /** 页数 */
    current?: number;
    /** 分页大小 */
    pageSize?: number;
    id?: string;
    /** 用户名 */
    username?: string;
    /** 账号过期 */
    accountExpired?: 'YES' | 'NO';
    /** 账号锁定 */
    accountLocked?: 'YES' | 'NO';
    /** 密码过期 */
    credentialsExpired?: 'YES' | 'NO';
    /** 账号启用 */
    enabled?: 'YES' | 'NO';
  };

  type pageUserParams = {
    pageUser: PageUser;
  };

  type PageUserVO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: UserVO[];
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type PermissionVO = {
    id: string;
    /** 权限名称 */
    name: string;
    /** 权限类型 */
    type: 'MENU' | 'BUTTON' | 'API';
    /** 请求URL */
    httpUrl?: string;
    /** 路径 */
    path?: string;
    /** 请求方法 */
    httpMethod?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 备注 */
    remark?: string;
    /** 权限值 */
    value: string;
    /** 序号 */
    ordinal: number;
    parentId?: string;
  };

  type ProjectDetail = {
    id: string;
    /** 项目名称 */
    name?: string;
    /** 构建工具 */
    buildTool: 'MAVEN' | 'GRADLE';
    /** git地址 */
    gitAddress: string;
    /** 项目成员 */
    members?: Member[];
    /** 项目描述 */
    description?: string;
    /** 创建时间 */
    gmtCreate: string;
  };

  type ProjectGroupDetail = {
    id: string;
    /** 项目组名称 */
    name?: string;
    /** 项目组成员 */
    members?: Member[];
    /** 项目组描述 */
    description?: string;
    /** 创建时间 */
    gmtCreate: string;
  };

  type ProjectGroupMember = {
    projectGroupId: string;
    /** 成员用户ID集合 */
    memberIds?: string[];
  };

  type ProjectGroupVO = {
    id: string;
    /** 项目组名称 */
    name: string;
    /** 项目组描述 */
    description?: string;
  };

  type ProjectMember = {
    projectId: string;
    /** 项目成员ID */
    memberIds?: string[];
  };

  type ProjectVO = {
    id: string;
    /** 项目名称 */
    name: string;
    templateId: string;
    projectGroupId: string;
    /** 构建工具 */
    buildTool: 'MAVEN' | 'GRADLE';
    /** git地址 */
    gitAddress: string;
    /** 项目描述 */
    description?: string;
  };

  type RequirementPriorityVO = {
    id: string;
    /** 优先级名称 */
    name: string;
    /** 卡片颜色 */
    color: string;
    /** 优先级描述 */
    description?: string;
  };

  type RoleInfo = {
    id: string;
    /** 角色名称 */
    name: string;
    /** 角色值 */
    value: string;
  };

  type RolePermissions = {
    roleId?: string;
    /** 权限ID集合 */
    permissionIds?: string[];
  };

  type RoleVO = {
    id: string;
    parentId?: string;
    /** 序号 */
    ordinal?: number;
    /** 角色名称 */
    name: string;
    /** 角色值 */
    value: string;
    /** 角色编码 */
    code: string;
    /** 父角色编码 */
    parentCode?: string;
    /** 创建时间 */
    gmtCreate: string;
  };

  type SimpleUser = {
    id: string;
    /** 用户名 */
    username: string;
  };

  type SortObject = {
    empty?: boolean;
    sorted?: boolean;
    unsorted?: boolean;
  };

  type TaskStepVO = {
    id: string;
    /** 步骤名称 */
    name: string;
    /** 步骤描述 */
    description?: string;
  };

  type TemplateDetail = {
    id: string;
    /** 模板名称 */
    name: string;
    /** 模板描述 */
    description?: string;
    /** 任务步骤 */
    taskSteps: TaskStepVO[];
    /** 需求优先级 */
    requirementPriorities: RequirementPriorityVO[];
  };

  type TreePermission = {
    id: string;
    /** 权限名称 */
    name: string;
    /** 权限类型 */
    type: 'MENU' | 'BUTTON' | 'API';
    /** 请求URL */
    httpUrl?: string;
    /** 请求方法 */
    httpMethod?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 备注 */
    remark?: string;
    /** 权限值 */
    value: string;
    /** 路径 */
    path?: string;
    parentId?: string;
    /** 子权限信息 */
    children?: TreePermission[];
  };

  type TreeRole = {
    id: string;
    /** 角色名称 */
    name: string;
    /** 角色值 */
    value: string;
    /** 角色编码 */
    code: string;
    parentId?: string;
    /** 子角色 */
    children?: TreeRole[];
  };

  type UpdatePermission = {
    id: string;
    /** 排序值 */
    ordinal?: number;
    parentId?: string;
    /** 权限名称 */
    name: string;
    /** 权限类型 */
    type: 'MENU' | 'BUTTON' | 'API';
    /** 路径 */
    path: string;
    /** 值 */
    value: string;
    /** 请求地址 */
    httpUrl?: string;
    /** 请求方法 */
    httpMethod?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 备注信息 */
    remark?: string;
  };

  type UpdateProject = {
    id: string;
    templateId: string;
    projectGroupId: string;
    /** 项目名称 */
    name: string;
    /** 构建工具 */
    buildTool: 'MAVEN' | 'GRADLE';
    /** git地址 */
    gitAddress: string;
    /** 项目描述 */
    description?: string;
  };

  type UpdateProjectGroup = {
    /** 项目组名称 */
    name: string;
    /** 项目组描述 */
    description?: string;
    id: string;
  };

  type UpdateRequirementPriority = {
    /** 优先级名称 */
    name: string;
    /** 卡片颜色 */
    color: string;
    /** 优先级描述 */
    description?: string;
    id: string;
  };

  type UpdateRole = {
    id: string;
    /** 排序值 */
    ordinal?: number;
    parentId?: string;
    /** 角色名称 */
    name: string;
    /** 角色值 */
    value: string;
    /** 角色编码 */
    code: string;
  };

  type UpdateTaskStep = {
    /** 步骤名称 */
    name: string;
    /** 步骤描述 */
    description?: string;
    id: string;
  };

  type UpdateTemplate = {
    /** 模板名称 */
    name: string;
    /** 模板描述 */
    description?: string;
    /** 任务步骤 */
    taskSteps: UpdateTaskStep[];
    /** 需求优先级 */
    requirementPriorities: UpdateRequirementPriority[];
    id: string;
  };

  type UpdateUser = {
    id: string;
    /** 用户名 */
    username: string;
    /** 账号过期 */
    accountExpired: 'YES' | 'NO';
    /** 账号未锁定 */
    accountLocked: 'YES' | 'NO';
    /** 密码未过期 */
    credentialsExpired: 'YES' | 'NO';
    /** 账号启用 */
    enabled: 'YES' | 'NO';
  };

  type UserDTO = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type UserPermission = {
    /** 路由权限 */
    paths?: string[];
  };

  type UserRoles = {
    userId?: string;
    /** 角色ID集合 */
    roleIds?: string[];
  };

  type UserVO = {
    id: string;
    /** 用户名 */
    username: string;
    /** 账号过期 */
    accountExpired: 'YES' | 'NO';
    /** 账号未锁定 */
    accountLocked: 'YES' | 'NO';
    /** 密码未过期 */
    credentialsExpired: 'YES' | 'NO';
    /** 账号启用 */
    enabled: 'YES' | 'NO';
    /** 注册时间 */
    gmtCreate: string;
  };
}
