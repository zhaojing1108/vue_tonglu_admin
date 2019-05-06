import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ad',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/ad/' + id,
    method: 'delete'
  })
}

export function dels(data) {
  return request({
    url: 'api/ads/bashDelAll',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/ad',
    method: 'put',
    data
  })
}
