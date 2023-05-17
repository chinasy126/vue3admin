import request from '@/utils/request';
import { AxiosPromise } from 'axios';

export function uploadImg(data: any, config: any) {
  return request({
    url: `/upload/pictures`,
    method: 'post',
    headers:config.headers,
    data
  });
}

