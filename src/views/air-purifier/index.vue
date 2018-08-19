<template>
  <div class="we-page"
       :style="{ 'background-image': 'url(' + bg + ')','background-repeat':'no-repeat','background-size':'cover' }">
    <div class="we-header">
      <router-link class="we-back" to="/list"><i class="iconfont icon-xiangzuojiantou"></i></router-link>
      {{ deviceName }}
      <span class="we-setting" @click="handleSetting"><i></i></span>
    </div>
    <div class="we-content">
      <div class="base-info-text">
        <span><i class="iconfont icon-weizhi vam"></i> {{ city }}</span>
        <span>{{ weather }} {{ outerTem }}</span>
        <span>湿度 {{ outerHum }}</span>
        <span>PM2.5 {{ outerPm }}μg/m³</span>
      </div>
      <div class="control-btn-group">
        <div class="btn" @click="show1 = true">
          <i class="iconfont icon-sheding"></i>
          <span>设定</span>
        </div>
        <div class="btn">
          <i class="iconfont icon-kaiguan" @click="handleOpen"></i>
          <span>开关</span>
        </div>
      </div>
      <div class="data-show-container">
        <div class="data-show"></div>
        <div class="data1">
          <div class="data-template1">
            <span>PM2.5</span>
            <span>{{ outerPm }}</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data2">
          <div class="data-template1">
            <span>PM2.5</span>
            <span>{{ pm }}</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data3">
          <div class="data-template2">室外</div>
        </div>
        <div class="data4">
          <div class="data-template3" :class="{ 'off': !isOpen }">
            <span>{{ puriEffic }}<span>%</span></span>
            <span>净化效率</span>
          </div>
        </div>
        <div class="data5">
          <div class="data-template4">室内</div>
        </div>
        <div class="data6">
          <div class="data-template5">
            <span><i class="iconfont icon-wendu"></i> {{ outerTem.replace('℃', '') }}<span>℃</span></span>
            <span><i class="iconfont icon-shidu"></i> {{ outerHum.replace('%', '') }}<span>%</span></span>
          </div>
        </div>
        <div class="data7">
          <div class="data-template5">
            <span><i class="iconfont icon-wendu"></i> {{ tem }}<span>℃</span></span>
            <span><i class="iconfont icon-shidu"></i> {{ hum }}<span>%</span></span>
          </div>
        </div>
      </div>
      <div class="data-alert" v-if="puriEffic < preJhSpinner">
        <i class="iconfont icon-baojing"></i>
        净化效率低，请更换滤网
      </div>
    </div>
    <div class="we-footer">
      <div class="func-sw">
        <i class="iconfont icon-jiare"></i>
        <div @click="handleSwitch('2B0', jrSwitch)">
          <yd-switch v-model="jrSwitch" :disabled="!isOpen" true-value="1" false-value="0"></yd-switch>
        </div>
      </div>
      <div class="func-sw">
        <i class="iconfont icon-jiashi"></i>
        <div @click="handleSwitch('250', jsSwitch)">
          <yd-switch v-model="jsSwitch" :disabled="!isOpen" true-value="1" false-value="0"></yd-switch>
        </div>
      </div>
      <div class="func-sw">
        <i class="iconfont icon-dianzijinghua"></i>
        <div @click="handleSwitch('2A0', jhSwitch)">
          <yd-switch v-model="jhSwitch" :disabled="!isOpen" true-value="1" false-value="0"></yd-switch>
        </div>
      </div>
    </div>
    <yd-popup v-model="show1" position="center" width="80%">
      <div class="we-popup">
        <div class="we-popup-body">
          <div class="we-form">
            <div class="we-input-group">
            <span class="we-label">
              <span>PM2.5 预值设定</span>
              <span>μg/m³</span>
            </span>
              <yd-spinner v-model="prePmSpinner" :min="0"></yd-spinner>
            </div>
            <div class="we-input-group">
            <span class="we-label">
              <span>净化效率预值设定</span>
              <span>%</span>
            </span>
              <yd-spinner v-model="preJhSpinner" :min="0"></yd-spinner>
            </div>
            <div class="we-input-group">
            <span class="we-label">
              <span>湿度最低预值设定</span>
              <span>%</span>
            </span>
              <yd-spinner v-model="preHumSpinner" :min="0"></yd-spinner>
            </div>
            <div class="we-input-group">
            <span class="we-label">
              <span>温度最低预值设定</span>
              <span>℃</span>
            </span>
              <yd-spinner v-model="preTemSpinner" :min="0"></yd-spinner>
            </div>
          </div>
        </div>
        <div class="we-popup-footer">
          <div class="we-btn-solid" @click="show1 = false">取消</div>
          <div class="we-btn" @click="handleSetFuncs">确认</div>
        </div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
  import {Loading, Toast} from 'vue-ydui/dist/lib.rem/dialog'
  import {Switch} from 'vue-ydui/dist/lib.rem/switch'
  import {Popup} from 'vue-ydui/dist/lib.rem/popup'
  import {Spinner} from 'vue-ydui/dist/lib.rem/spinner'
  import img from '../../assets/bak4.jpg'
  import {setWechatTitle} from 'utils'
  import apiURI from 'common/js/api'

  export default {
    components: {
      'yd-switch': Switch,
      'yd-popup': Popup,
      'yd-spinner': Spinner
    },
    data () {
      return {
        jrSwitch: true,
        jsSwitch: true,
        jhSwitch: true,
        show1: false,
        prePmSpinner: 0,
        preJhSpinner: 0,
        preTemSpinner: 0,
        preHumSpinner: 0,
        bg: img,
        isOpen: true,
        // 以下来自设备详情接口
        deviceName: '',
        city: '',
        weather: '',
        outerTem: '0',
        outerHum: '0',
        outerPm: '0',
        puriEffic: '0',
        pm: '0',
        tem: '0',
        hum: '0',
        loopLoadTimeSet: null
      }
    },
    created () {
      this.deviceName = sessionStorage.getItem('name')
      setWechatTitle(this.deviceName)
      this.getDeviceDetail()
      this.loopLoadTimeSet = setInterval(() => {
        this.getDeviceDetail()
      }, 3000)
    },
    methods: {
      handleOpen () {
        let data = {
          deviceId: this.$route.query.deviceId,
          funcId: '210',
          value: this.isOpen ? '0' : '1'
        }
        this.$http.post(apiURI.sendFunc, data).then(res => {
          if (res.code === 200) {
            this.isOpen = !this.isOpen
            if (this.isOpen) {
              Toast({
                mes: '开启成功',
                timeout: 1500,
                icon: 'success'
              })
              this.bg = img
            } else {
              Toast({
                mes: '关闭成功',
                timeout: 1500,
                icon: 'success'
              })
              this.bg = null
            }
          }
        })
      },
      handleSetting () {
        this.$router.push({
          path: '/set',
          query: {
            deviceId: this.$route.query.deviceId
          }
        })
      },
      getDeviceDetail () {
        this.$http.get(apiURI.queryDetailByDeviceId + '?deviceId=' + this.$route.query.deviceId).then(res => {
          if (res.code === 200) {
            const data = res.data
            console.log(data)
            if (res.data.modeItem.value === '0') {
              this.isOpen = false
              this.bg = null
            }
            this.city = data.city
            this.weather = data.weather
            this.outerTem = data.outerTem
            this.outerHum = data.outerHum
            this.outerPm = data.outerPm
            this.puriEffic = data.puriEffic.data
            this.pm = data.pm.data
            this.tem = data.tem.data
            this.hum = data.hum.data

            const funcList = [].concat.apply([], data.funcs)

            this.jrSwitch = funcList.find((element) => element.type === '2B0').value
            this.jsSwitch = funcList.find((element) => element.type === '250').value
            this.jhSwitch = funcList.find((element) => element.type === '2A0').value
            this.prePmSpinner = data.prePM25.data
            this.preJhSpinner = data.prePuriEffic.data
            this.preHumSpinner = data.preHum.data
            this.preTemSpinner = data.preTem.data
          }
        }).catch(() => {
        })
      },
      handleSwitch (code, value) {
        this.sendFunc(code, value === '0' ? '1' : '0')
      },
      sendFunc (code, value) {
        Loading.open('发送中...')
        let data = {
          deviceId: this.$route.query.deviceId,
          funcId: code,
          value: value
        }
        this.$http.post(apiURI.sendFunc, data).then(res => {
          if (res.code === 200) {
            Loading.close()
            Toast({
              mes: '发送成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        }).catch(() => {
          Loading.close()
        })
      },
      asyncSendFunc (code, value) {
        return new Promise((resolve, reject) => {
          let data = {
            deviceId: this.$route.query.deviceId,
            funcId: code,
            value: value
          }
          this.$http.post(apiURI.sendFunc, data).then(res => {
            if (res.code === 200) {
              resolve()
            }
          }).catch(e => {
            reject(e)
          })
        })
      },
      handleSetFuncs () {
        Promise.all([
          this.asyncSendFunc('2DD.0', this.preTemSpinner),
          this.asyncSendFunc('2DE.0', this.preHumSpinner),
          this.asyncSendFunc('2DF.0', this.prePmSpinner),
          this.asyncSendFunc('2DG.0', this.preJhSpinner)
        ]).then(() => {
          Toast({
            mes: '设置成功',
            timeout: 1500,
            icon: 'success'
          })
          this.show1 = false
        }).catch(() => {
          Toast({
            mes: '设置失败',
            timeout: 1500,
            icon: 'fail'
          })
        })
      }
    },
    beforeDestroy () {
      clearInterval(this.loopLoadTimeSet)
    }
  }
</script>

<style lang="scss" scoped>
  .we-form {
    padding: 0 .5rem;
  }

  .we-input-group {
    display: flex;
    margin-bottom: .4rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .we-label {
    color: #fff;
    display: flex;
    flex-direction: column;
    text-align: right;
    flex: 1;
    justify-content: center;
    margin-right: .5rem;
    span:nth-child(1) {
      font-size: .2rem;
    }
    span:nth-child(2) {
      font-size: .18rem;
    }
  }

  .we-btn, .we-btn-solid {
    padding: .15rem .3rem;
    font-size: .36rem;
    border: 1px solid #2689ee;
    border-radius: 5px;
    color: #2689ee;
    font-weight: bold;
    text-align: center;
    display: inline-block;
    width: 2.2rem;
  }

  .we-btn {
    background-color: #2689ee;
    color: #fff;
  }

  .we-popup {
    border-radius: 5px;
    overflow: hidden;
    .we-popup-body {
      background-color: #2689ee;
      padding: .3rem;
    }
    .we-popup-footer {
      padding: .3rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
    }
  }

  .we-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #999999;
    display: flex;
    flex-direction: column;
  }

  .we-header {
    position: relative;
    height: .85rem;
    /*background-color: #2493f1;*/
    /*background-color: #ccc;*/
    font-size: .3rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .we-back {
    position: absolute;
    color: #fff;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: .85rem;
  }

  .we-setting {
    position: absolute;
    color: #fff;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: .85rem;
    i {
      height: 20px;
      width: 20px;
      background: url('../../assets/set.png') no-repeat center center;
      background-size: 20px 20px;
    }
  }

  .we-content {
    padding: .3rem .5rem;
    flex: 1;
    overflow: auto;
  }

  .we-footer {
    height: 2rem;
    /*background-color: #2493f1;*/
    /*background-color: #ccc;*/
    padding: .4rem 0;
    display: flex;
    justify-content: space-around;
  }

  .vam {
    vertical-align: middle;
  }

  .base-info-text {
    font-size: .2rem;
    color: #fff;
    /*display: flex;*/
    /*align-items: center;*/
    margin-bottom: .5rem;
    span {
      margin-right: .25rem;
    }
  }

  .control-btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem;
    padding: 0 .3rem;
    .btn {
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: .2rem;

      i {
        font-size: .8rem;
      }
    }
  }

  .data-show {
    background: url('~assets/air-purifier-data-show-bg.png') no-repeat;
    background-size: contain;
    width: 6.39rem;
    height: 2.78rem;
    display: block;
    margin: auto;
  }

  .data-show-container {
    padding: .5rem 0;
    position: relative;
    margin-bottom: .5rem;
    .data-template1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      span:nth-child(1) {
        color: #e6e6e6;
        font-size: .26rem;
      }
      span:nth-child(2) {
        color: #fff;
        font-size: .65rem;
      }
      span:nth-child(3) {
        color: #e6e6e6;
        font-size: .20rem;
      }
    }
    .data-template2 {
      font-size: .21rem;
      color: #b6f94b;
    }
    .data-template3 {
      display: flex;
      flex-direction: column;
      /*align-items: center;*/
      text-align: center;
      width: 100%;
      span:nth-child(1) {
        font-size: .92rem;
        color: #ffff00;
        span {
          font-size: .23rem;
          color: #e6e6e6;
        }
      }

      &.off {
        span:nth-child(1) {
          color: #d86e5d;
        }
      }

      span:nth-child(2) {
        font-size: .15rem;
        color: #e6e6e6;
      }
    }

    .data-template4 {
      font-size: .21rem;
      color: #c5d6ff;
    }

    .data-template5 {
      display: flex;
      flex-direction: column;
      span {
        color: #fff;
        font-size: .35rem;
        span {
          color: #e6e6e6;
          font-size: .17rem;
        }
      }
    }

    .data1 {
      position: absolute;
      top: .25rem;
      left: .4rem;
    }

    .data2 {
      position: absolute;
      top: .25rem;
      right: .4rem;
    }

    .data3 {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 1.3rem;
      height: .15rem;
      margin: auto;
    }

    .data4 {
      position: absolute;
      top: 1.3rem;
      right: 0;
      left: 0;
      /*margin: auto;*/
    }

    .data5 {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 1.5rem;
      height: .15rem;
      margin: auto;
    }

    .data6 {
      position: absolute;
      bottom: .16rem;
      left: .25rem;
    }

    .data7 {
      position: absolute;
      bottom: .16rem;
      right: .25rem;
    }
  }

  .func-sw {
    display: flex;
    flex-direction: column;
    align-items: center;
    i {
      font-size: .6rem;
      color: #fff;
      margin-bottom: .2rem;
    }
  }

  .data-alert {
    text-align: center;
    color: #fff;
    font-size: .29rem;
    i {
      color: #ff0000;
    }
  }
</style>

<style lang="scss">
  .func-sw {
    .yd-switch {
      width: .8rem;
      height: .3rem;
      &:checked::after {
        transform: translateX(.5rem);
      }
      &::after {
        width: .3rem;
        height: .3rem;
      }
      &::before {
        width: .8rem;
        height: .3rem;
      }
    }
  }
</style>
