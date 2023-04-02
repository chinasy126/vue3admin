import request from '@/utils/request'

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix = `product`

export function dataListByPage(params:any, currentPage:number = 1, pageSize:number = 10) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  })
}

export function dataInsert(params:any) {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  })
}

export function dataDelete(param:any) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: param
  })
}


/**
 * 数据新增或者修改
 * @param params
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(params:any){
  return request({
    url: `/${urlPrefix}/saveOrUpdate`,
    method: 'post',
    data: params
  })
}

export function dataModify(params:any) {
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
