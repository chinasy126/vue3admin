import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = `productclass`

export function dataListByPage(params: any, currentPage: number, pageSize: number) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

export function dataInsert(params: any) {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  })
}

export function dataDelete(data: any) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: data
  })
}


export function dataModify(params: any) {
  return request({
    url: `/${urlPrefix}/modify`,
    method: 'post',
    data: params
  })
}

export function category() {
  return request({
    url: `/${urlPrefix}/category`,
    method: 'post'
  })
}
