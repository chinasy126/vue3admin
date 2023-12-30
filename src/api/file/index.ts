import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FileInfo } from './types';

export function uploadImg(data: any, config: any) {
  return request({
    url: `/upload/pictures`,
    method: 'post',
    headers:config.headers,
    data
  });
}

export function uploadFileApi(data: any, config: any = {}): AxiosPromise<FileInfo> {
  return request({
    url: `/upload/pictures`,
    method: 'post',
    headers:config.headers,
    data
  });

  // const formData = new FormData();
  // formData.append('file', file);
  // return request({
  //   url: '/api/v1/files',
  //   method: 'post',
  //   data: formData,
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // });
}

/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function deleteFileApi(filePath?: string) {
  return request({
    url: '/api/v1/files',
    method: 'delete',
    params: { filePath: filePath }
  });
}
