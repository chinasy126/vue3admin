import request from '@/utils/request';

/**
 * 简单分页
 * @param current
 * @param size
 * @returns {AxiosPromise}
 */

const urlPrefix: string = `menu`;

export function dataListByPage(params: any, currentPage: number, pageSize: number) {
  return request({
    url: `/${urlPrefix}/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  });
}


export function menuList(params: any, currentPage: number, pageSize: number) {
  return request({
    url: `/${urlPrefix}/menulist?currentPage=${currentPage}&pageSize=${pageSize}`,
    method: 'post',
    data: params
  });
}


export function dataInsert(params: any) {
  return request({
    url: `/${urlPrefix}/insert`,
    method: 'post',
    data: params
  });
}

/**
 * 按照条件操作
 * @param params
 * @returns {AxiosPromise}
 */

export function dataDelete(params: any) {
  return request({
    url: `/${urlPrefix}/delete`,
    method: 'delete',
    data: params
  });
}

/**
 * 批量删除
 * @param params
 * @returns {AxiosPromise}
 */
export function dataBatchDelete(params: any) {
  return request({
    url: `/${urlPrefix}/batchdelete`,
    method: 'delete',
    data: params
  });
}

export function getDetail(id: number) {
  return request({
    url: `/${urlPrefix}/getdetail`,
    method: 'post',
    data: id
  });
}

export function dataModify(params: any) {
  return request({
    url: `/${urlPrefix}/modify`,
    method: 'post',
    data: params
  });
}


export function allMultilevelClassification() {
  return request({
    url: `/${urlPrefix}/multiclassclassification`,
    method: 'post'
  });
}

/**
 * 批量插入
 * @param params
 * @returns {AxiosPromise}
 */
export function batchInsert(params: any) {
  return request({
    // url: `/menuButton/menubutton/list`,
    url: `/${urlPrefix}/batch`,
    method: 'post',
    data: params
  });
}

/**
 * 新接口，新增或者修改
 * @param params
 * @returns {AxiosPromise}
 */
export function saveOrUpdate(params: any) {
  return request({
    url: `/${urlPrefix}/saveOrUpdate`,
    method: 'post',
    data: params
  });
}

/**
 * 批量新增菜单
 * @param params
 */
export function batchMenuSave(params: any[]) {
  return request({
    url: `/${urlPrefix}/batch`,
    method: 'post',
    data: params
  });
}


/**
 * 获取菜单一级分类
 */
export function category() {
  return request({
    url: `/menu/category`,
    method: 'post'
  });
}


/**
 * 获取二级菜单
 * @param data
 * @returns {AxiosPromise}
 */
export function getSecMenuList(data: any) {
  return request({
    url: `/menu/getSecMenuList`,
    method: 'post',
    data
  });
}


/**
 * 插入按钮数据
 * @param data
 * @returns {AxiosPromise}
 */
export function indertBtn(data: any) {
  return request({
    url: `/menubutton/indertBtn`,
    method: 'post',
    data
  });
}
