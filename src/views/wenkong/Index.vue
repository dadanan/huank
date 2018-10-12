<template>
  <div class='index-container' :class="{ cold: currentOption == 0,hot: currentOption == 1,wind: currentOption == 2,off: currentOption == 3 }" v-show='pageIsShow'>
    <div class='header'>
      <img src='@/assets/arrow_left.png' @click='goBack()'>
      <span>{{deviceName}}</span>
      <img class='setting' @click='intoSet' src='@/assets/set.png'>
    </div>
    <div class='info'>
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
      <span v-show='formatItemsList[9] && formatItemsList[9].showStatus'>{{location}}&nbsp;</span>
      <span v-show='formatItemsList[10] && formatItemsList[10].showStatus'>{{weather}} {{outerTem}}&nbsp;</span>
      <span v-if='formatItemsList[11] && formatItemsList[11].showStatus'>湿度: {{outerHum}}%&nbsp;</span>
      <span v-show='formatItemsList[12] && formatItemsList[12].showStatus'>PM2.5: {{outerPm}}ug/m3</span>
    </div>
    <div class='switch'>
      <div v-show='formatItemsList[7] && formatItemsList[7].showStatus'>
        <div class='left'>
          <img src='@/assets/status-open.png' v-if='status'>
          <img src='@/assets/status-close.png' v-else>
        </div>
        <p>{{formatItemsList[7] && formatItemsList[7].showName}}</p>
      </div>
      <div v-show='formatItemsList[8] && formatItemsList[8].showStatus' @click='onOffMethod'>
        <div>
          <img src='@/assets/wenkong_close.png' v-if='isOpen'>
          <img src='@/assets/wenkong_close.png' v-else>
        </div>
        <p>{{formatItemsList[8] && formatItemsList[8].showName}}</p>
      </div>
    </div>
    <div class='main'>
      <div>
        <h3>设定值</h3>
        <h1 v-if='formatItemsList[4]'>{{getAbilityData(formatItemsList[4].abilityId).currValue}}</h1>
        <h3 class='last'>℃</h3>
      </div>
    </div>
    <div class='current-info'>
      <p v-if='formatItemsList[4] && formatItemsList[4].showStatus'>
        {{formatItemsList[4] && formatItemsList[4].showName}}
        <span class='strong'>{{getAbilityData(formatItemsList[4].abilityId).currValue}}</span>
        ℃
      </p>
      <p v-if='formatItemsList[5] && formatItemsList[5].showStatus'>
        {{formatItemsList[5] && formatItemsList[5].showName}}
        <span class='strong'>{{getAbilityData(formatItemsList[5].abilityId).currValue}}</span>
        %
      </p>
    </div>
    <div class='function' v-show='formatItemsList[3] && formatItemsList[3].showStatus'>
      <div v-for='item in functionList' @click='functionClicked(item)' :class="{able: item.able}" :key='item.id'>
        <span>{{item.definedName}}</span>
      </div>
    </div>
    <div class='menu'>
      <div @click='modelClickedHandler(formatItemsList[0] && formatItemsList[0].abilityId,0)' v-show='formatItemsList[0] && formatItemsList[0].showStatus'>
        <div>
          <img class='first' src='@/assets/temperature.png'>
        </div>
        <span>{{formatItemsList[0] && formatItemsList[0].showName}}</span>
      </div>
      <div @click='modelClickedHandler(formatItemsList[1].abilityId,1)' v-show='formatItemsList[1] && formatItemsList[1].showStatus'>
        <div>
          <img src='@/assets/model.png'>
        </div>
        <span>{{formatItemsList[1] && formatItemsList[1].showName}}</span>
      </div>
      <div @click='modelClickedHandler(formatItemsList[2] && formatItemsList[2].abilityId,2)' v-show='formatItemsList[2] && formatItemsList[2].showStatus'>
        <div>
          <img class='third' src='@/assets/wind.png'>
        </div>
        <span>{{formatItemsList[2] && formatItemsList[2].showName}}</span>
      </div>
    </div>
    <div class='left-side' v-show='formatItemsList[6] && formatItemsList[6].showStatus'>
      <div>
        <img class='first' src='@/assets/wind.png'>
        <span>{{windData.abilityOptionList && windData.abilityOptionList[currentOptionForWind].optionDefinedName}}</span>
      </div>
      <div>
        <img class='second' src='@/assets/model.png'>
        <span>{{modelData.abilityOptionList && modelData.abilityOptionList[currentOption].optionDefinedName}}</span>
      </div>
    </div>
    <!-- 模式 -->
    <yd-popup v-model="modelVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">{{modelData.definedName}}</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in modelData.abilityOptionList" :key="index" :class="{ active: currentOption == index }" @click='modelClicked(index,modelData)'>
              <span>{{ item.optionDefinedName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <!-- 风速 -->
    <yd-popup v-model="windVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">{{windData.definedName}}</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in windData.abilityOptionList" :key="index" :class="{ active: currentOptionForWind == index }" @click='modelClicked(index,windData,3)'>
              <span>{{ item.optionDefinedName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="temperatureVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">温度设定</div>
        <div class="list">
          <div class='inside'>
            <img @click='increase' src='@/assets/add.png'>
            <div>
              <span class='number'>{{temperature}}</span>
              <span class='icon'>℃</span>
            </div>
            <img @click='reduce' src='@/assets/reduce.png'>
          </div>
        </div>
      </div>
    </yd-popup>
    <div class='gif'>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { Popup } from 'vue-ydui/dist/lib.rem/popup'
import { Picker } from 'mint-ui'
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from './api'
import Store from './store'
let hasSetTemperature = false // 初始化时根据当前温度设置下「预设温度」的值
let isInited = false // 是否已经被初始化了

export default {
  data() {
    return {
      modelVisible: false, //
      windVisible: false, //
      pageIsShow: false,
      temperature: 0, // 客户设定温度
      temperatureVisible: false, // 显示温度设定弹框
      currentOption: 0, // 模式的当前选择项
      currentOptionForWind: 0, // 风速的当前选择项
      windModel: true, // 用户点击了风速模块?
      modelData: {},
      windData: {},
      functionList: [],
      deviceName: '',
      customerName: '',
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
      isOpen: null, // 开机状态？
      status: false // 主机状态
    }
  },
  methods: {
    setTemperature() {
      // 动态显示温度的值
      if (!this.formatItemsList[4] || hasSetTemperature) {
        return
      }
      const ablityId = this.formatItemsList[4].abilityId
      const data = this.abilitysList.filter(
        item => item.abilityId === ablityId
      )[0]

      this.temperature = Number(data.currValue)
      this.hasSetTemperature = true
    },
    switchHandler() {
      // 保证只初始化一次
      if (isInited) {
        return
      }
      // 开关机初始化
      const tempArray = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[8].abilityId
      )[0].abilityOptionList

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1]

      if (tempObj.isSelect === 1) {
        // 说明是关机
        this.isOpen = false
      } else {
        this.isOpen = true
      }

      // 主机状态初始化
      const tempArray2 = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[7].abilityId
      )[0].abilityOptionList

      const tempObj2 =
        tempArray2[0].dirValue == 0 ? tempArray2[0] : tempArray2[1]
      if (tempObj2.isSelect === 1) {
        // 说明是关机
        this.status = false
      } else {
        this.status = true
      }

      isInited = true
    },
    onOffMethod() {
      // 开关机

      const tempArray = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[8].abilityId
      )[0]
      const tempList = tempArray.abilityOptionList
      let index = 0
      if (this.isOpen) {
        // 找“关”的项
        index = tempList.findIndex(item => item.dirValue === '0')
      } else {
        index = tempList.findIndex(item => item.dirValue === '1')
      }

      sendFunc({
        deviceId: this.deviceId,
        funcId: tempArray.dirValue,
        value: tempList[index].dirValue
      }).then(res => {
        this.isOpen = !this.isOpen
        console.info(
          '指令发送成功:',
          tempArray.dirValue,
          '-',
          tempList[index].dirValue
        )
      })
    },
    getAbilityData(abilityId) {
      const result = this.abilitysList.filter(
        item => item.abilityId === abilityId
      )[0]
      return result
    },
    goBack() {
      history.back()
    },
    setModelData(id, index) {
      const data = this.abilitysList.filter(item => item.abilityId === id)[0]
      if (!data) {
        return
      }

      // 如何用户点击的是“模式”
      index === 1 ? (this.modelData = data) : (this.windData = data)

      // 根据isSelect的值，对相应选项执行默认选中行为
      data.abilityOptionList.forEach((item, iIndex) => {
        if (item.isSelect === 0) {
          return
        }

        // “模式”
        if (index === 1) {
          this.currentOption = iIndex
          return
        }
        this.currentOptionForWind = iIndex
      })
    },
    modelClickedHandler(id, index) {
      if (index === 0) {
        // 如果用户唤起温度框
        this.temperatureVisible = true
        return
      }

      this.setModelData(id, index)
      index === 1 ? (this.modelVisible = true) : (this.windVisible = true)
    },
    increase() {
      this.temperature += 1
      const data = this.getAbilityData(this.formatItemsList[0].abilityId)
      this.sendFunc(data.dirValue, this.temperature)
    },
    reduce() {
      this.temperature -= 1
      const data = this.getAbilityData(this.formatItemsList[0].abilityId)
      this.sendFunc(data.dirValue, this.temperature)
    },
    intoSet() {
      this.$router.push({
        path: '/wenkongset',
        query: {
          deviceId: this.deviceId
        }
      })
    },
    modelClicked(index, data, which) {
      if (which === 3) {
        this.currentOptionForWind = index
      } else {
        this.currentOption = index
      }
      this.sendFunc(data.dirValue, data.abilityOptionList[index].dirValue)
    },
    sendFunc(funcId, value) {
      // 发送指令
      sendFunc({
        deviceId: this.deviceId,
        funcId: funcId,
        value: value
      }).then(res => {
        console.info('指令发送成功:', funcId, '-', value)
      })
    },
    functionClicked(item) {
      this.functionList.forEach(list => {
        list['able'] = false
      })
      item['able'] = true
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data
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

        this.switchHandler()
        this.setTemperature()
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
    }
  },
  watch: {
    isOpen(val) {
      this.currentOption = val ? 2 : 3
    }
  },
  created() {
    setTimeout(() => {
      this.pageIsShow = true
    }, 1000)
    // Store.save('Ticket', 'oJlAuv3VTrGAo0P3N3jY41mVvkuI')
    this.deviceName = Store.fetch('deviceName')
    this.customerName = Store.fetch('customerName')
    setWechatTitle(this.customerName, '')

    this.getIndexAbilityData()
    this.getLocation()
    this.getWeather()
  },
  destroyed() {
    clearInterval(this.setInter)
  },
  components: {
    'yd-popup': Popup,
    'mt-picker': Picker
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
@import '~@/assets/scss-function.scss';

.index-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('~@/assets/background.png');
  display: flex;
  flex-direction: column;
  .header {
    box-sizing: border-box;
    margin: tvw(0) tvw(162) auto tvw(162);
    font-size: 16px;
    line-height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: tvw(125);
      color: #f2f2f2;
      font-weight: bold;
    }
    img:first-child {
      display: block;
      height: tvw(111);
      position: absolute;
      left: 0;
    }
    img.setting {
      display: block;
      position: absolute;
      right: 0;
      height: tvw(140);
    }
  }
  .info {
    margin: 0 auto tvw(34) auto;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      color: #fff;
      font-size: tvw(83);
    }
  }
  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: tvw(2485);
    margin: auto;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      > div {
        border-radius: 50%;
        border: 0.5px solid #fff;
        width: tvw(251);
        height: tvw(251);
        margin-bottom: tvw(50);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        input {
          transform: scale(0.5);
          position: absolute;
          left: -tvw(55);
        }
        img {
          width: tvw(147);
          position: relative;
          top: -tvw(10);
        }
      }
      p {
        color: #fff;
      }
    }
    div.left {
      img {
        width: 80%;
        position: relative;
        top: 0.2px;
      }
    }
  }
  .main {
    width: tvw(1501);
    height: tvw(1472);
    border: 1px solid #ffffff;
    border-radius: 50%;
    margin: auto;
    margin-top: tvw(150);
    > div {
      width: 95%;
      height: 100%;
      border: 1px solid #ffffff;
      border-radius: 50%;
      margin: 0 auto;
      line-height: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      * {
        font-weight: normal;
      }
      h3 {
        color: #fff;
        font-size: tvw(150);
      }
      h1 {
        color: #00ffdc;
        font-size: tvw(650);
        margin-top: tvw(100);
        margin-bottom: tvw(100);
      }
      h3 {
        color: #fff;
        font-size: tvw(200);
        margin-bottom: tvw(20);
      }
    }
  }
  .current-info {
    width: tvw(2485);
    margin: auto;
    margin-top: tvw(100);
    margin-bottom: tvw(100);
    font-size: tvw(130);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      width: fit-content;
      .strong {
        font-size: tvw(350);
      }
    }
  }
  .function {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    div.able {
      background-image: url('~@/assets/able.png');
    }
    div {
      background-image: url('~@/assets/disable.png');
      background-size: contain;
      background-repeat: no-repeat;
      height: tvw(350);
      width: tvw(450);
      display: flex;
      line-height: 1;
      justify-content: center;
      align-items: center;
      span {
        top: -tvw(10);
        position: relative;
        color: white;
      }
    }
  }
  .menu {
    width: tvw(2485);
    margin: auto;
    margin-bottom: tvw(100);
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: tvw(300);
        height: tvw(300);
        border: 2px solid #fff;
        img {
          height: tvw(180);
        }
        img:not(.first) {
          transform: scale(0.65);
        }
        img.third {
          transform: scale(0.8);
        }
      }
      span {
        margin-top: tvw(50);
        font-size: tvw(125);
        color: #fff;
      }
    }
  }
  .content {
    padding: 20px 15px 20px 15px;
    color: #4d4d4d;
    .title {
      font-size: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dfdfdf;
    }
    .list {
      & ul li {
        font-size: 14px;
        margin-top: 20px;
        .icon {
          float: right;
          margin-right: 5px;
          width: 20px;
          height: 20px;
          border: 1px solid #a3a3a3;
          border-radius: 100%;
        }
        &.active {
          .icon {
            background: url('../../assets/select.png') no-repeat center center;
            background-size: 20px 20px;
            border: none;
          }
        }
      }
      .inside {
        width: fit-content;
        display: flex;
        align-items: center;
        margin: tvw(442) auto tvw(505) auto;
        > div {
          margin: auto tvw(205);
          width: tvw(605);
          height: tvw(255);
          background-image: url('~@/assets/small_background.png');
          background-size: cover;
          background-repeat: no-repeat;
          line-height: tvw(255);
          text-align: center;
          color: #fff;
          span.number {
            font-size: tvw(150);
          }
          span.icon {
            font-size: tvw(17);
          }
        }
        img {
          width: tvw(141);
          height: tvw(141);
        }
      }
    }
  }
  .left-side {
    position: fixed;
    width: tvw(700);
    height: tvw(600);
    left: 0;
    top: 32%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background: #217dea;
    opacity: 0.9;
    border-radius: 0 3vw 3vw 0;
    > div {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        color: white;
        font-size: 15px;
        width: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 21px;
      }
    }
    img {
      opacity: 0.5;
      height: tvw(160);
      margin-right: tvw(90);
    }
    img.first {
      transform: scale(0.9);
    }
    img.second {
      transform: scale(0.7);
    }
  }
  .gif {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 40vh;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
    opacity: 0.5;
  }
}

@-webkit-keyframes flow {
  0% {
    top: 0;
  }
  100% {
    top: 40%;
  }
}

@-webkit-keyframes blow {
  0% {
    right: -100%;
  }
  100% {
    right: 100%;
  }
}

@-webkit-keyframes shine {
  0% {
    right: -100%;
  }
  100% {
    right: 100%;
  }
}

.index-container.wind {
  background-image: url('~@/assets/background.png');
  .gif {
    background-image: url('~@/assets/blow-wind.png');
    -webkit-animation: blow 15s infinite linear;
    top: 20%;
    height: 20vh;
  }
}
.index-container.hot {
  background: #ea9705;
  .gif {
    background-image: url('~@/assets/sunshine.png');
    -webkit-animation: shine 12s infinite linear;
    width: 150vw;
    height: 80vh;
    top: -42vh;
  }
}

.index-container.cold {
  background: #004696;
  .gif {
    background-image: url('~@/assets/flow-snow.png');
    -webkit-animation: flow 8s infinite linear;
  }
}

.index-container.off {
  background: grey;
}
</style>

