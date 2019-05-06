import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bannerMenu',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/bannerMenu/' + id,
    method: 'delete'
  })
}

export function dels(data) {
  return request({
    url: 'api/bannerMenu/bashDel',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/bannerMenu',
    method: 'put',
    data
  })
}
