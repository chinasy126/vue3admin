// /**
//  * 操作弹窗的信息
//  */
// export interface opFormDialog {
//   title: string,
//   visible: boolean,
//   buttonTitle: string,
//   message: string
// }

export interface opFormDialog {
  title: string,
  visible: boolean,
  buttonTitle: string
}

/**
 * 数据返回类型
 */
export interface Result {
  success: boolean,
  code: number,
  message: string,
  data: any,
}
