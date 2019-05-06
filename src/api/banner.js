import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/banner',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/banner/' + id,
    method: 'delete'
  })
}

export function dels(data) {
  return request({
    url: 'api/banner/bashDel',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/banner',
    method: 'put',
    data
  })
}
