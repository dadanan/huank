const BASE_URL = 'http://dev.hcocloud.com'
import { http } from '@/common/js/https'
import Store from './store'

export function newQueryDetailByDeviceId(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/newQueryDetailByDeviceId`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket')
    }
  })
}

export function getModelVo(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/format/getModelVo`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket')
    }
  })
}

export function editDevice(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/editDevice`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function token(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/token`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function getToken(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/getToken`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function delToken(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/delToken/${id}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function addChildDevice(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/addChildDevice`,
    method: 'post',
    data,
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function childDeviceList(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/high/childDeviceList/${deviceId}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function delChildDevice(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/delChildDevice/${id}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function getLocation(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/api/getLocation/${deviceId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function getWeather(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/api/getWeather/${deviceId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function modelList(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/modelList/${id}`,
    method: 'get',
    headers: {
      Ticket: Store.fetch('Ticket'),
      Authorization: Store.fetch('Token')
    }
  })
}

export function obtainMyDevice() {
  return http({
    url: `${BASE_URL}/api/h5/api/obtainMyDevice`,
    method: 'post',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function sendFunc(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/sendFunc`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function updateTeamName(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/updateTeamName`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function updateDeviceTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/updateDeviceTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function deleteTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/deleteTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function createTeam(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/team/createTeam`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function addTimer(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/addTimer`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function editTimer(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/editTimer`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function queryTimerList(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/queryTimerList`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function cancelTimer(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/cancelTimer`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function timerDetail(timerId) {
  return http({
    url: `${BASE_URL}/api/h5/api/timerDetail/${timerId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function timerType() {
  return http({
    url: `${BASE_URL}/api/h5/api/timerType`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function deleteTimer(timerId) {
  return http({
    url: `${BASE_URL}/api/h5/api/deleteTimer/${timerId}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function appid(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/user/appid`,
    method: 'post',
    data
  })
}

export function auth(customerId, code) {
  return http({
    url: `${BASE_URL}/api/h5/api/user/auth?customerId=${customerId}&code=${code}`,
    method: 'get'
  })
}

export function share(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/share`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

// 接触设备绑定？
export function deleteDevice(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/deleteDevice`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function getSign(url) {
  return http({
    url: `${BASE_URL}/api/h5/api/getSign?url=${url}`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function list() {
  return http({
    url: `${BASE_URL}/api/h5/api/group/list`,
    method: 'get',
    headers: { Ticket: Store.fetch('Ticket') }
  })
}

export function groupSendFunc(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/group/groupSendFunc`,
    method: 'post',
    data,
    headers: { Ticket: Store.fetch('Ticket') }
  })
}
