import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/travelPoint',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/travelPoint/' + id,
    method: 'delete'
  })
}

export function dels(data) {
  return request({
    url: 'api/travelPointDetail/bashDel',
    method: 'delete',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/travelPoint',
    method: 'put',
    data
  })
}

export function editdetail(id) {
  return request({
    url: 'api/travelPointDetail/'+ id,
    method: 'get'
  })
}

