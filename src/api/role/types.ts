/**
 * 角色查询参数类型
 */
export interface RoleQuery extends PageQuery {
  keywords?: string;
}

/**
 * 角色分页列表项
 */
export interface Role {
  id: string;
  name: string;
  code: string;
  sort: number;
  status: number;
  deleted: number;
  menuIds?: any;
  permissionIds?: any;
}

/**
 * 角色分页项类型
 */
export type RolePageResult = PageResult<Role[]>;

/**
 * 角色表单
 */
export interface RoleForm {
  id?: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  /**
   * 数据权限
   */
  dataScope: number;
}


/**
 * 用户菜单权限
 */

export interface RoleMenus {
  id?: number;
  roleId: number;
  menuId:number;
  menuTitle:string;
  menuFid:number;
  menuButton:string;
  rolebuttonsList:Rolebuttons[];
}


export interface Rolebuttons {
  id?: number;
  roleMenuId: number;
  buttonName:string;
  buttonType:string;
  roleId:number;
  menuId:number
}
