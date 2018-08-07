<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
import myUrl  from 'common/js/api'
import { getQueryString } from 'utils'

export default {
  data () {
    return {
    }
  },
  components: {
  },
  created(){
    this.authMethod();
  },
  computed: {
  },
  watch: {
  },
  mounted(){
  },
  methods:{
    authMethod(){
      let that = this;
      this.$http.get(myUrl.auth + '?code='+getQueryString('code')+'').then(function(res){
         if(res.code === 200){
          sessionStorage.setItem('Ticket',res.data);
          that.$router.push({
              path:'/list',
            })
         }else{
           if(res.code === 604){//token失效
              this.redireact();
           }
         }
      })
      .catch(function(error){
        if(error.code === 604){//token失效
          this.redireact();
        }
        that.$toast(error.msg,'bottom');
      })
    },
    redireact(){
      let baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
      let params = {
        appid:this.GLOBAL.appId,
        redirect_uri:this.GLOBAL.redUrl,
        response_type:'code',
        scope:'snsapi_userinfo',
        state:'STATE#wechat_redirect'
      }
      if(getQueryString('masterOpenId')){//从分享进入,存储分享人信息
        let obj = {
          deviceId:getQueryString('deviceId'),
          masterOpenId:getQueryString('masterOpenId'),
          token:getQueryString('token')
        }
        sessionStorage.setItem('obj',JSON.stringify(obj));
      }
      
      let redirectUrl = baseUrl + '?appid='+params.appid+'&redirect_uri='+params.redirect_uri+'&response_type='+params.response_type+'&scope='+params.scope+'&state='+params.state;
        //window.location.href = redirectUrl;
      }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/common/scss/variable.scss";
  @import "src/common/scss/mixins.scss";
  


  
</style>

