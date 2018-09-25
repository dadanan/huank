<template>
  <div class="we-page" :style="{ 'background-image': 'url(' + bg + ')','background-repeat':'no-repeat','background-size':'cover' }">
    <div class="we-header">
      <router-link class="we-back" to="/list">
        <i class="iconfont icon-xiangzuojiantou"></i>
      </router-link>
      {{ pageName }}
      <span class="we-setting" @click="handleSetting">
        <i></i>
      </span>
    </div>
    <div class="we-content">
      <div class="base-info-text">
        <span v-if='formatItemsList[12] && formatItemsList[12].showStatus'>
          <i class="iconfont icon-weizhi vam"></i> {{ location }}</span>
        <span v-if='formatItemsList[13] && formatItemsList[13].showStatus'>{{ weather }} {{ outerTem }}</span>
      </div>
      <div class="control-btn-group">
        <div class="btn" @click="show1 = true" v-if='formatItemsList[10] && formatItemsList[10].showStatus'>
          <i class="iconfont icon-sheding"></i>
          <span>{{formatItemsList[10].showName || '设定'}}</span>
        </div>
        <div class="btn" v-if='formatItemsList[11] && formatItemsList[11].showStatus'>
          <i class="iconfont icon-kaiguan" @click="handleOpen"></i>
          <span>{{formatItemsList[11].showName || '开关'}}</span>
        </div>
      </div>
      <div class="data-show-container">
        <div class="data-show"></div>
        <div class="data1">
          <div class="data-template1" v-if='formatItemsList[7] && formatItemsList[7].showStatus'>
            <span>PM2.5</span>
            <span>{{ outerPm }}</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data2">
          <div class="data-template1" v-if='formatItemsList[8] && formatItemsList[8].showStatus'>
            <span>PM2.5</span>
            <span>{{ getAbilityData(formatItemsList[8].abilityId).currValue}}</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data3">
          <div class="data-template2">室外</div>
        </div>
        <div class="data4" v-if='formatItemsList[9] && formatItemsList[9].showStatus'>
          <div class="data-template3" :class="{ 'off': !isOpen }">
            <span>{{ puriEffic }}
              <span>%</span>
            </span>
            <span>净化效率</span>
          </div>
        </div>
        <div class="data5">
          <div class="data-template4">室内</div>
        </div>
        <div class="data6">
          <div class="data-template5">
            <span v-if='formatItemsList[3] && formatItemsList[3].showStatus'>
              <i class="iconfont icon-wendu"></i> {{ outerTem.replace('℃', '') }}
              <span>℃</span>
            </span>
            <span v-if='formatItemsList[4] && formatItemsList[4].showStatus'>
              <i class="iconfont icon-shidu"></i> {{ outerHum.replace('%', '') }}
              <span>%</span>
            </span>
          </div>
        </div>
        <div class="data7">
          <div class="data-template5">
            <span v-if='formatItemsList[5] && formatItemsList[5].showStatus'>
              <i class="iconfont icon-wendu"></i> {{ getAbilityData(formatItemsList[5].abilityId).currValue }}
              <span>℃</span>
            </span>
            <span v-if='formatItemsList[6] && formatItemsList[6].showStatus'>
              <i class="iconfont icon-shidu"></i> {{ getAbilityData(formatItemsList[6].abilityId).currValue }}
              <span>%</span>
            </span>
          </div>
        </div>
      </div>
      <div class="data-alert" v-if="puriEffic < preJhSpinner">
        <i class="iconfont icon-baojing"></i>
        净化效率低，请更换滤网
      </div>
    </div>
    <div class="we-footer">
      <div class="func-sw" v-if='formatItemsList[0] && formatItemsList[0].showStatus'>
        <i class="iconfont icon-jiare"></i>
        <div @click="handleSwitch('2B0', jrSwitch)">
          <!-- :disabled="!isOpen" -->
          <yd-switch v-model="jrSwitch" true-value="1" false-value="0"></yd-switch>
        </div>
      </div>
      <div class="func-sw" v-if='formatItemsList[1] && formatItemsList[1].showStatus'>
        <i class="iconfont icon-jiashi"></i>
        <div @click="handleSwitch('250', jsSwitch)">
          <yd-switch v-model="jsSwitch" true-value="1" false-value="0"></yd-switch>
        </div>
      </div>
      <div class="func-sw" v-if='formatItemsList[2] && formatItemsList[2].showStatus'>
        <i class="iconfont icon-dianzijinghua"></i>
        <div @click="handleSwitch('2A0', jhSwitch)">
          <yd-switch v-model="jhSwitch" true-value="1" false-value="0"></yd-switch>
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
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { Switch } from 'vue-ydui/dist/lib.rem/switch'
import { Popup } from 'vue-ydui/dist/lib.rem/popup'
import { Spinner } from 'vue-ydui/dist/lib.rem/spinner'
import img from '../../assets/bak4.jpg'
import { setWechatTitle } from 'utils'
import apiURI from 'common/js/api'
import Store from '../wenkong/store'
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from '../wenkong/api'

export default {
  components: {
    'yd-switch': Switch,
    'yd-popup': Popup,
    'yd-spinner': Spinner
  },
  data() {
    return {
      jrSwitch: '0',
      jsSwitch: '0',
      jhSwitch: '0',
      show1: false,
      prePmSpinner: 0,
      preJhSpinner: 0,
      preTemSpinner: 0,
      preHumSpinner: 0,
      bg: img,
      isOpen: true,
      pm: '0',
      tem: '0',
      hum: '0',
      loopLoadTimeSet: null,
      once: true,
      pageName: '',
      formatItemsList: [],
      abilitysList: [],
      location: '',
      weather: '',
      outerTem: '',
      outerHum: '', // 湿度
      outerPm: '', // PM2.5
      deviceId: this.$route.query.deviceId,
      wxDeviceId: this.$route.query.wxDeviceId,
      setInter: undefined, // 定时器的id
      isOpen: false, // 开机状态？
      status: false // 主机状态
    }
  },
  computed: {
    puriEffic() {
      const data = this.formatItemsList[9]
      if (data) {
        return this.getAbilityData(data.abilityId).currValue
      }
      return 62
    }
  },
  methods: {
    handleOpen() {
      this.sendFunc('210', this.isOpen ? '0' : '1', () => {
        this.isOpen = !this.isOpen
        if (this.isOpen) {
          Toast({
            mes: '开启成功',
            timeout: 1500,
            icon: 'success'
          })
        } else {
          Toast({
            mes: '关闭成功',
            timeout: 1500,
            icon: 'success'
          })
        }
      })
    },
    handleSetting() {
      this.$router.push({
        path: '/set',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    handleSwitch(code, value) {
      this.sendFunc(code, value === '0' ? '1' : '0')
    },
    sendFunc(funcId, value, cb) {
      Loading.open('发送中...')
      sendFunc({
        deviceId: this.$route.query.deviceId,
        funcId,
        value
      })
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            Toast({
              mes: '发送成功',
              timeout: 1000,
              icon: 'success'
            })
            console.log('指令发送成功', funcId, '-', value)
            if (cb) {
              cb()
            }
          }
        })
        .catch(() => {
          Loading.close()
        })
    },
    asyncSendFunc(code, value) {
      return new Promise((resolve, reject) => {
        let data = {
          deviceId: this.$route.query.deviceId,
          funcId: code,
          value: value
        }
        sendFunc({
          deviceId: this.$route.query.deviceId,
          funcId: code,
          value: value
        })
          .then(res => {
            if (res.code === 200) {
              resolve()
            }
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    handleSetFuncs() {
      Promise.all([
        this.asyncSendFunc('2DD.0', this.preTemSpinner),
        this.asyncSendFunc('2DE.0', this.preHumSpinner),
        this.asyncSendFunc('2DF.0', this.prePmSpinner),
        this.asyncSendFunc('2DG.0', this.preJhSpinner)
      ])
        .then(() => {
          Toast({
            mes: '设置成功',
            timeout: 1500,
            icon: 'success'
          })
          this.show1 = false
        })
        .catch(() => {
          Toast({
            mes: '设置失败',
            timeout: 1500,
            icon: 'fail'
          })
        })
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data
          this.pageName = data.pageName
          this.formatItemsList = data.formatItemsList

          data.abilitysList.forEach(item => {
            item['currValue'] = ''
          })
          this.abilitysList = data.abilitysList
          // 定时请求接口数据，更新页面数据
          this.setInter = setInterval(() => {
            this.getIndexFormatData(res.data)
          }, 2000)
        }
      })
    },
    getIndexFormatData(list) {
      // 获取H5控制页面功能项数据，带isSelect参数

      // 根据功能项id筛选功能项
      const findTheAbility = (data, id) => {
        return data.filter(item => item.id === id)[0]
      }

      newQueryDetailByDeviceId({
        deviceId: this.deviceId,
        abilityIds: list.formatItemsList
          .filter(item => item.abilityId)
          .map(item => item.abilityId)
      }).then(res => {
        const data = res.data
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList.forEach((item, index) => {
          // 如果有值，说明是温度功能项，讲数值拿过来
          if (data[index] && data[index].currValue) {
            // 找到对应的温度功能项对象
            const temp = this.abilitysList.filter(
              itemA => itemA.abilityId === data[index].id
            )[0]
            if (!data[index]) {
              return
            }
            try {
              temp.currValue = data[index].currValue
            } catch (e) {
              // 怪异的错误，就算判断data[index]不为空，也会出现currValue of undefined错误～
            }
          }
          if (!item.abilityOptionList || item.abilityOptionList.length === 0) {
            return
          }
          item.abilityType !== 1 &&
            item.abilityOptionList.forEach((option, oIndex) => {
              const result = findTheAbility(data, item.abilityId)
              if (result) {
                const temp = Object.assign(
                  option,
                  result.abilityOptionList[oIndex]
                )
              }
            })
        })

        this.initHandler()
        this.initSwitch()
      })
    },
    getLocation() {
      getLocation(this.deviceId).then(res => {
        this.location = res.data.location
      })
    },
    getWeather() {
      getWeather(this.deviceId).then(res => {
        const data = res.data

        this.weather = data.weather
        this.outerTem = data.outerTem
        this.outerPm = data.outerPm
        this.outerHum = data.outerHum
      })
    },
    getAbilityData(abilityId) {
      const result = this.abilitysList.filter(
        item => item.abilityId === abilityId
      )[0]
      return result
    },
    initHandler() {
      // 初始化下方三个按钮的状态
      if (this.formatItemsList[0]) {
        const temp = this.getAbilityData(this.formatItemsList[0].abilityId)
          .abilityOptionList

        const tempObj = temp[0].dirValue == 0 ? temp[0] : temp[1]
        if (tempObj.isSelect === 1) {
          // 说明是关
          this.jrSwitch = '0'
        } else {
          this.jrSwitch = '1'
        }
      }

      if (this.formatItemsList[1]) {
        const temp = this.getAbilityData(this.formatItemsList[1].abilityId)
          .abilityOptionList

        const tempObj = temp[0].dirValue == 0 ? temp[0] : temp[1]
        if (tempObj.isSelect === 1) {
          // 说明是关
          this.jsSwitch = '0'
        } else {
          this.jsSwitch = '1'
        }
      }

      if (this.formatItemsList[2]) {
        const temp = this.getAbilityData(this.formatItemsList[2].abilityId)
          .abilityOptionList

        const tempObj = temp[0].dirValue == 0 ? temp[0] : temp[1]
        if (tempObj.isSelect === 1) {
          // 说明是关
          this.jhSwitch = '0'
        } else {
          this.jhSwitch = '1'
        }
      }
    },
    initSwitch() {
      // 初始化开关的状态
      const tempArray = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[11].abilityId
      )[0].abilityOptionList

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1]
      if (tempObj.isSelect === 1) {
        // 说明是关机
        this.isOpen = false
      } else {
        this.isOpen = true
      }
    }
  },
  created() {
    this.pageName = Store.fetch('name')
    setWechatTitle(this.pageName)

    // Store.save('oJlAuv3vgnY6fRxH_UyDKZ3Kg7K4')
    this.getIndexAbilityData()
    this.getLocation()
    this.getWeather()
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.bg = img
      } else {
        this.bg = null
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.setInter)
  }
}
</script>

<style lang="scss" scoped>
.we-form {
  padding: 0 0.5rem;
}

.we-input-group {
  display: flex;
  margin-bottom: 0.4rem;
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
  margin-right: 0.5rem;
  span:nth-child(1) {
    font-size: 0.2rem;
  }
  span:nth-child(2) {
    font-size: 0.18rem;
  }
}

.we-btn,
.we-btn-solid {
  padding: 0.15rem 0.3rem;
  font-size: 0.36rem;
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
    padding: 0.3rem;
  }
  .we-popup-footer {
    padding: 0.3rem;
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
  height: 0.85rem;
  /*background-color: #2493f1;*/
  /*background-color: #ccc;*/
  font-size: 0.3rem;
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
  width: 0.85rem;
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
  width: 0.85rem;
  i {
    height: 20px;
    width: 20px;
    background: url('../../assets/set.png') no-repeat center center;
    background-size: 20px 20px;
  }
}

.we-content {
  padding: 0.3rem 0.5rem;
  flex: 1;
  overflow: auto;
}

.we-footer {
  height: 2rem;
  /*background-color: #2493f1;*/
  /*background-color: #ccc;*/
  padding: 0.4rem 0;
  display: flex;
  justify-content: space-around;
}

.vam {
  vertical-align: middle;
}

.base-info-text {
  font-size: 0.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  span {
    margin-right: 0.25rem;
  }
}

.control-btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0 0.3rem;
  .btn {
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.2rem;

    i {
      font-size: 0.8rem;
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
  padding: 0.5rem 0;
  position: relative;
  margin-bottom: 0.5rem;
  .data-template1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    span:nth-child(1) {
      color: #e6e6e6;
      font-size: 0.26rem;
    }
    span:nth-child(2) {
      color: #fff;
      font-size: 0.65rem;
    }
    span:nth-child(3) {
      color: #e6e6e6;
      font-size: 0.2rem;
    }
  }
  .data-template2 {
    font-size: 0.21rem;
    color: #b6f94b;
  }
  .data-template3 {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    text-align: center;
    width: 100%;
    span:nth-child(1) {
      font-size: 0.92rem;
      color: #ffff00;
      span {
        font-size: 0.23rem;
        color: #e6e6e6;
      }
    }

    &.off {
      span:nth-child(1) {
        color: #d86e5d;
      }
    }

    span:nth-child(2) {
      font-size: 0.15rem;
      color: #e6e6e6;
    }
  }

  .data-template4 {
    font-size: 0.21rem;
    color: #c5d6ff;
  }

  .data-template5 {
    display: flex;
    flex-direction: column;
    span {
      color: #fff;
      font-size: 0.35rem;
      span {
        color: #e6e6e6;
        font-size: 0.17rem;
      }
    }
  }

  .data1 {
    position: absolute;
    top: 0.25rem;
    left: 0.4rem;
  }

  .data2 {
    position: absolute;
    top: 0.25rem;
    right: 0.4rem;
  }

  .data3 {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 1.3rem;
    height: 0.15rem;
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
    height: 0.15rem;
    margin: auto;
  }

  .data6 {
    position: absolute;
    bottom: 0.16rem;
    left: 0.25rem;
  }

  .data7 {
    position: absolute;
    bottom: 0.16rem;
    right: 0.25rem;
  }
}

.func-sw {
  display: flex;
  flex-direction: column;
  align-items: center;
  i {
    font-size: 0.6rem;
    color: #fff;
    margin-bottom: 0.2rem;
  }
}

.data-alert {
  text-align: center;
  color: #fff;
  font-size: 0.29rem;
  i {
    color: #ff0000;
  }
}
</style>

<style lang="scss">
.func-sw {
  .yd-switch {
    width: 0.8rem;
    height: 0.3rem;
    &:checked::after {
      transform: translateX(0.5rem);
    }
    &::after {
      width: 0.3rem;
      height: 0.3rem;
    }
    &::before {
      width: 0.8rem;
      height: 0.3rem;
    }
  }
}
</style>
