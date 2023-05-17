import request from '@/utils/request';

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix: string = `news`;

/**
 * 获取分页
 * @param params
 * @param currentPage
 * @param pageSize
 */
export function dataListByPage(params: any, currentPage: number, pageSize: number) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  });
}


/**
 * 插入数据
 * @param params
 * @returns {AxiosPromise}
 */
export function newsInsert(params: any) {
  return request({
    url: `/news/insert`,
    method: 'post',
    data: params
  });
}

/**
 * 操作数据
 * @param params
 * @returns {AxiosPromise}
 */
export function newsModify(params: any) {
  return request({
    url: `/news/saveOrUpdate`,
    method: 'post',
    data: params
  });
}

/**
 * 删除数据
 * @param id
 * @returns {AxiosPromise}
 */

export function newsDelete(data: any) {
  return request({
    url: `/news/delete/`,
    method: 'delete',
    data: data
  });
}

/**
 * 获取单条数据
 * @param param
 * @returns {AxiosPromise}
 */
export function getDetail(param: any) {
  return request({
    url: `/news/find`,
    method: 'post',
    data: param
  });
}

/**
 * 更新数据
 * @param id
 * @param param
 * @returns {AxiosPromise}
 */
export function updateDetail(id: number, param: any) {
  return request({
    url: `/news/update?id=${id}`,
    method: 'post',
    data: param
  });
}

/**
 * 导出EXCEL
 * @returns {AxiosPromise}
 */
export function exportExcelData(param: any) {
  return request({
    url: `/news/export`,
    method: 'post',
    data: param,
    // headers: {
    //   Accept: '*',
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    // },
    responseType: 'blob'
  });
}

export function importExcelData() {
  return request({
    url: `/news/import`,
    method: 'post'
  });
}


export function batchDelete(params: Number[]) {
  return request({
    url: `/news/batchDelete`,
    method: 'delete',
    data: params
  });
};


export function importFileData(param: any, config: any, callback: any) {
  console.log(config)

  return request({
    url: `/news/import`,
    method: 'post',
    headers: config.headers,
    onUploadProgress: callback,
    data: param
  });
}
