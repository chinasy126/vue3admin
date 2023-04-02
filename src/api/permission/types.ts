/**
 * 列表用户查询
 */
export interface queryParams extends PageQuery {
  username: string;
}

export interface UserListType {
  id: number | undefined,
  username: string,
  password: string,
  birthday: string,
  roleId: number,
  createTime: string,
  updateTime: string,
  roleName: string,
  avatar: string
}


/**
 * 用户表单类型声明
 */
export interface UserForm {
  id: number | undefined,
  username:string;
  password:string;
  birthday:string
  roleId:number
  createTime:string
  updateTime:string
  avatar:string;
}
