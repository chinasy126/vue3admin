import request from "@/utils/request";
import {queryParams, UserForm} from "@/api/permission/types";

const urlPrefix: string = `user`

/**
 * 获取用户列表
 * @param params
 * @param currentPage
 * @param pageSize
 */
export function dataListByPage(params: queryParams, currentPage = 1, pageSize = 10) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

/**
 * 新增用户
 * @param param
 */
export function insertData(param: {}) {
  return request({
    url: `/${urlPrefix}/insertOrUpdate`,
    method: 'post',
    data: param
  })
}

/**
 * 删除用户
 * @param id
 */
export function deleteData(params: any) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: params
  })
}

/**
 * 添加用户
 *
 * @param data
 */
export function saveOrUpdate(param: UserForm) {
  return request({
    url: `/${urlPrefix}/insertOrUpdate`,
    method: 'post',
    data: param
  })
}


/**
 * 批量删除
 * @param params
 */

export function batchDelete(params: number[]) {
  return request({
    url: `/${urlPrefix}/batchDelete`,
    method: 'delete',
    data: params
  });
};
