import request from '@/utils/request';
import {AxiosPromise} from 'axios';

import {queryParams} from "@/api/permission/types";


/**
 * 获取角色分页数据
 *
 * @param queryParams
 */

const urlPrefix: string = 'role'

export function getRolePages(params:any, currentPage = 1, pageSize = 10){

  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

export function insertRole(params:any) {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  })
}

/**
 * 修改数据
 * @param params
 * @returns {AxiosPromise}
 */
export function modifyRole(params:any) {
  return request({
    url: `/${urlPrefix}/modify`,
    method: 'post',
    data: params
  })
}

/**
 * 删除角色
 * @param params
 * @returns {AxiosPromise}
 */
export function deleteData(params:any) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: params
  })
}


export function deleteBtn(params:any) {
  return request({
    url: `/menubutton/delete`,
    method: 'post',
    data: params
  })
}
