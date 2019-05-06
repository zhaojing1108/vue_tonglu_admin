import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/activityInformation',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/activityInformation/' + id,
    method: 'delete'
  })
}

export function dels(data) {
  return request({
    url: 'api/activityInformation/bashDel',
    method: 'delete',
    data: data
  })
}

export function edit(data) {
  return request({
    url: 'api/activityInformation',
    method: 'put',
    data
  })
}

export function editdetail(id) {
  return request({
    url: 'api/getinformationDetail/'+ id,
    method: 'get'
  })
}

