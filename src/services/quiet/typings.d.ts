declare namespace API {
  type AddIteration = {
    /** 迭代名称 */
    name: string;
    versionId: string;
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 迭代描述 */
    description?: string;
  };

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

  type AddRequirement = {
    /** 需求标题 */
    title: string;
    typeId: string;
    priorityId: string;
    projectId: string;
    reporterId: string;
    handlerId: string;
    /** 描述 */
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

  type AddRequirementType = {
    /** 需求类型名称 */
    name: string;
    /** 需求类型描述 */
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

  type AddTaskType = {
    /** 任务类型名称 */
    name: string;
    /** 任务类型描述 */
    description?: string;
  };

  type AddTemplate = {
    /** 模板名称 */
    name: string;
    /** 模板描述 */
    description?: string;
    /** 任务步骤 */
    taskSteps: AddTaskStep[];
    /** 任务类型 */
    taskTypes: AddTaskType[];
    /** 需求优先级 */
    requirementPriorities: AddRequirementPriority[];
    /** 需求类型 */
    requirementTypes: AddRequirementType[];
  };

  type AddVersion = {
    /** 版本名称 */
    name: string;
    projectId: string;
    parentId?: string;
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 版本描述 */
    description?: string;
  };

  type CurrentUser = {
    id?: string;
    /** 用户名称 */
    username: string;
    permission?: UserPermission;
    /** 用户拥有的角色信息 */
    roles?: RoleInfo[];
  };

  type deleteIterationParams = {
    id: string;
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

  type deleteRequirementParams = {
    id: string;
  };

  type deleteRoleParams = {
    /** 角色ID */
    id: string;
  };

  type deleteTemplateParams = {
    id: string;
  };

  type deleteUserParams = {
    /** 用户ID */
    id: string;
  };

  type deleteVersionParams = {
    id: string;
  };

  type getIterationDetailParams = {
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

  type getVersionDetailParams = {
    id: string;
  };

  type IterationDetail = {
    id: string;
    /** 迭代名称 */
    name: string;
    /** 迭代状态 */
    status: 'PLANNED' | 'ONGOING' | 'DONE' | 'ARCHIVED';
    versionId: string;
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 迭代描述 */
    description?: string;
    /** 需求信息 */
    requirements?: string[];
  };

  type IterationVO = {
    id: string;
    /** 迭代名称 */
    name: string;
    /** 迭代状态 */
    status: 'PLANNED' | 'ONGOING' | 'DONE' | 'ARCHIVED';
    versionId: string;
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 迭代描述 */
    description?: string;
  };

  type listCurrentUserProjectParams = {
    projectGroupId: string;
  };

  type listPermissionParams = {
    /** 角色ID */
    roleId: string;
  };

  type listProjectGroupUserParams = {
    projectGroupId: string;
    /** 用户名 */
    username: string;
  };

  type ListRequirement = {
    /** 需求标题 */
    title?: string;
    projectId: string;
    typeId?: string;
    priorityId?: string;
    /** 需求状态 */
    status?: 'TO_BE_PLANNED' | 'PLANNED' | 'PROCESSING' | 'DONE' | 'CLOSED';
    offset: string;
    limit: string;
  };

  type listRequirementByIterationIdParams = {
    iterationId: string;
  };

  type listRequirementParams = {
    listRequirement: ListRequirement;
  };

  type listRolesParams = {
    /** 用户ID */
    userId: string;
  };

  type listTemplateParams = {
    /** 模板名称 */
    name?: string;
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
    paged?: boolean;
    unpaged?: boolean;
    pageSize?: number;
    pageNumber?: number;
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
    numberOfElements?: number;
    pageable?: PageableObject;
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
    numberOfElements?: number;
    pageable?: PageableObject;
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
    numberOfElements?: number;
    pageable?: PageableObject;
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
    numberOfElements?: number;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
  };

  type PageTemplate = {
    /** 页数 */
    current?: number;
    /** 分页大小 */
    pageSize?: number;
    id?: string;
    /** 模板名称 */
    name?: string;
    /** 模板描述 */
    description?: string;
  };

  type pageTemplateParams = {
    pageTemplate: PageTemplate;
  };

  type PageTemplateVO = {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: TemplateVO[];
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    pageable?: PageableObject;
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
    numberOfElements?: number;
    pageable?: PageableObject;
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

  type PlanningRequirement = {
    requirementId: string;
    iterationId?: string;
  };

  type ProjectDetail = {
    id: string;
    /** 项目名称 */
    name?: string;
    projectGroup: SimpleProjectGroup;
    template: SimpleTemplate;
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

  type RequirementTypeVO = {
    id: string;
    /** 需求类型名称 */
    name: string;
    /** 需求类型描述 */
    description?: string;
  };

  type RequirementVO = {
    id: string;
    /** 需求标题 */
    title: string;
    typeId: string;
    /** 需求状态 */
    status: 'TO_BE_PLANNED' | 'PLANNED' | 'PROCESSING' | 'DONE' | 'CLOSED';
    priorityId: string;
    projectId: string;
    iterationId?: string;
    reporterId: string;
    handlerId: string;
    /** 描述 */
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

  type SimpleIteration = {
    id: string;
    /** 迭代名称 */
    name: string;
    /** 迭代状态 */
    status: 'PLANNED' | 'ONGOING' | 'DONE' | 'ARCHIVED';
  };

  type SimpleProject = {
    id?: string;
    /** 项目名称 */
    name?: string;
  };

  type SimpleProjectGroup = {
    id: string;
    /** 项目组名称 */
    name: string;
  };

  type SimpleTemplate = {
    id: string;
    /** 模板名称 */
    name: string;
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

  type TaskTypeVO = {
    id: string;
    /** 任务类型名称 */
    name: string;
    /** 任务类型描述 */
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
    /** 任务类型 */
    taskTypes: TaskTypeVO[];
    /** 需求优先级 */
    requirementPriorities: RequirementPriorityVO[];
    /** 需求优类型 */
    requirementTypes: RequirementTypeVO[];
  };

  type TemplateVO = {
    id: string;
    /** 模板名称 */
    name: string;
    /** 模板描述 */
    description?: string;
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

  type TreeVersionDetail = {
    id: string;
    /** 版本名称 */
    name: string;
    /** 版本状态 */
    status: 'PLANNED' | 'ONGOING' | 'DONE' | 'ARCHIVED';
    /** 子版本信息 */
    children?: TreeVersionDetail[];
    /** 迭代信息 */
    iterations?: SimpleIteration[];
  };

  type treeVersionDetailParams = {
    projectId: string;
  };

  type UpdateIteration = {
    /** 迭代名称 */
    name: string;
    versionId: string;
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 迭代描述 */
    description?: string;
    id: string;
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

  type UpdateRequirement = {
    /** 需求标题 */
    title: string;
    typeId: string;
    priorityId: string;
    projectId: string;
    reporterId: string;
    handlerId: string;
    /** 描述 */
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

  type UpdateRequirementType = {
    /** 需求类型名称 */
    name: string;
    /** 需求类型描述 */
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

  type UpdateTaskType = {
    /** 任务类型名称 */
    name: string;
    /** 任务类型描述 */
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
    /** 任务类型 */
    taskTypes: UpdateTaskType[];
    /** 需求优先级 */
    requirementPriorities: UpdateRequirementPriority[];
    /** 需求类型 */
    requirementTypes: UpdateRequirementType[];
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

  type UpdateVersion = {
    /** 版本名称 */
    name: string;
    projectId: string;
    parentId?: string;
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 版本描述 */
    description?: string;
    id: string;
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

  type VersionDetail = {
    id: string;
    /** 版本名称 */
    name: string;
    projectId: string;
    parentId?: string;
    /** 版本状态 */
    status: 'PLANNED' | 'ONGOING' | 'DONE' | 'ARCHIVED';
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
    /** 实际开始时间 */
    actualStartTime?: string;
    /** 实际结束时间 */
    actualEndTime?: string;
    /** 版本描述 */
    description?: string;
    /** 子版本 */
    children?: VersionVO[];
    /** 在该版本的迭代信息 */
    iterations?: IterationVO[];
  };

  type VersionVO = {
    id: string;
    /** 版本名称 */
    name: string;
    projectId: string;
    parentId?: string;
    /** 版本状态 */
    status: 'PLANNED' | 'ONGOING' | 'DONE' | 'ARCHIVED';
    /** 计划开始时间 */
    plannedStartTime?: string;
    /** 计划结束时间 */
    plannedEndTime?: string;
  };
}
