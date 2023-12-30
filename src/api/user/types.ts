/**
 * 登录用户信息
 */
import { string } from 'fast-glob/out/utils';

export interface UserInfo {
  nickname: string;
  avatar: string;
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageQuery {
  keywords: string;
  status: number;
  deptId: number;
}

/**
 * 用户分页列表项声明
 */
export interface UserType {
  id: string;
  username: string;
  nickname: string;
  mobile: string;
  gender: number;
  avatar: string;
  email: string;
  status: number;
  deptName: string;
  roleNames: string;
  createTime: string;
}

/**
 * 用户分页项类型声明
 */
export type UserPageResult = PageResult<UserType[]>;

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

export interface UserImportData{

}



export interface UserOldPassword{
  password:string
}


export interface avatarModify {
  avatar: string;
}
