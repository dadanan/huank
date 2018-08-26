<template>
  <div class="kaiche">
    <yd-button style="margin-top: 0" size="large" type="primary" shape="circle" @click.native="kaiche">替我开车</yd-button>
  </div>
</template>

<style lang="scss" scoped>
  .kaiche {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../assets/bak1.jpg");
    background-size: cover;
  }
</style>

<script>
  import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
  import { Button } from 'vue-ydui/dist/lib.rem/button'
  import API from 'common/js/api'

  export default {
    components: {
      'yd-button': Button
    },
    methods: {
      kaiche () {
        console.log('kaiche')
        let data = {
          deviceId: 'gh_db8607de9a99_41854abad30d591f',
          funcId: '010',
          value: '0101'
        }
        // 发送指令
        Loading.open('发送中...')
        this.$http.post(API.sendFunc, data).then(res => {
          Loading.close()
          if (res.code === 200) {
            Toast({
              mes: '发送成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        })
        .catch(() => {
          Loading.close()
          console.log('发送失败')
        })
      }
    }
  }
</script>
