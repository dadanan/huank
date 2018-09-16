<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
import myUrl from 'common/js/api'
import { auth } from '../wenkong/api'
import { getQueryString } from 'utils'

export default {
  created() {
    this.authMethod()
  },
  methods: {
    authMethod() {
      auth(sessionStorage.getItem('customerId'), getQueryString('code'))
        .then(res => {
          // 拿到微信openid
          sessionStorage.setItem('Ticket', res.data)
          this.$router.push({
            path: '/list'
          })
        })
        .catch(err => {
          console.error('auth-error-->', err)
        })
    },
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
          token: getQueryString('token')
        }
        sessionStorage.setItem('obj', JSON.stringify(obj))
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
        params.state
      window.location.href = redirectUrl
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
</style>

