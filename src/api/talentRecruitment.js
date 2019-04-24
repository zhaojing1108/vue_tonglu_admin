import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/talentRecruitment',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/talentRecruitment/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/talentRecruitment',
    method: 'put',
    data
  })
}

export function editdetail(id) {
  return request({
    url: 'api/talentDetail/'+ id,
    method: 'get'
  })
}

