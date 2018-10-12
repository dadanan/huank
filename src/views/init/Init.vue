<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
import { appid } from '../wenkong/api'
import Store from '../wenkong/store'
import { getQueryString } from 'utils'

export default {
  created() {
    const customerId = getQueryString('customerId')
    if (customerId) {
      Store.save('customerId', customerId)
      this.getAppId(customerId)
    }
  },
  methods: {
    getAppId(id) {
      appid({
        value: id
      }).then(res => {
        // 用拿到appid，换微信code
        this.redireact(res.data)
      })
    },
    redireact(id) {
      let baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
      let params = {
        appid: id,
        redirect_uri: this.GLOBAL.redUrl,
        response_type: 'code',
        scope: 'snsapi_userinfo',
        state: 'STATE#wechat_redirect'
      }
      if (getQueryString('masterOpenId')) {
        // 从分享进入,存储分享人信息
        let obj = {
          deviceId: getQueryString('deviceId'),
          masterOpenId: getQueryString('masterOpenId'),
          token: getQueryString('token'),
          customerId: getQueryString('customerId')
        }
        Store.save('obj', JSON.stringify(obj))
      }

      let redirectUrl =
        baseUrl +
        '?appid=' +
        params.appid +
        '&redirect_uri=' +
        params.redirect_uri +
        '&response_type=' +
        params.response_type +
        '&scope=' +
        params.scope +
        '&state=' +
        params.state +
        '&customerId=' +
        getQueryString('customerId')
      window.location.href = redirectUrl
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
</style>

