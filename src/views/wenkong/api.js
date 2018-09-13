const BASE_URL = 'http://dev.hcocloud.com'
const headers = { Ticket: 'oJlAuv2-eXUQm12G5NItUJy7OvLQ' }
import { http } from '@/common/js/https'
import Store from './store'

export function newQueryDetailByDeviceId(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/newQueryDetailByDeviceId`,
    method: 'post',
    data,
    headers
  })
}

export function getModelVo(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/format/getModelVo`,
    method: 'post',
    data,
    headers
  })
}

export function token(data) {
  return http({
    url: `${BASE_URL}/api/h5/api/token`,
    method: 'post',
    data,
    headers
  })
}

export function getToken(data) {
  return http({
    url: `${BASE_URL}/api/h5/high/getToken`,
    method: 'post',
    data,
    headers
  })
}

export function delToken(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/delToken/${id}`,
    method: 'get',
    headers: {
      ...headers,
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
      ...headers,
      Authorization: Store.fetch('Token')
    }
  })
}

export function childDeviceList(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/high/childDeviceList/${deviceId}`,
    method: 'get',
    headers: {
      ...headers,
      Authorization: Store.fetch('Token')
    }
  })
}

export function delChildDevice(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/delChildDevice/${id}`,
    method: 'get',
    headers: {
      ...headers,
      Authorization: Store.fetch('Token')
    }
  })
}

export function getLocation(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/api/getLocation/${deviceId}`,
    method: 'get',
    headers
  })
}

export function getWeather(deviceId) {
  return http({
    url: `${BASE_URL}/api/h5/api/getWeather/${deviceId}`,
    method: 'get',
    headers
  })
}

export function modelList(id) {
  return http({
    url: `${BASE_URL}/api/h5/high/modelList/${id}`,
    method: 'get',
    headers: {
      ...headers,
      Authorization: Store.fetch('Token')
    }
  })
}
