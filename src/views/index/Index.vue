<template>
  <div class="main-wrapper" :class="{ active: isOpen === true }" v-if="deviceObj.pm" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')','background-repeat':'no-repeat','background-size':'cover' }">
    <div class="header">
      <span>{{ deviceName }}</span>
      <span class="edit" @click="intoSet"></span>
      <span class="time" v-if="1===2">{{ currentTime }}s</span>
    </div>
    <div class="info">
      <img src="../../assets/map.png" style="width:12px;height:auto"/>
      {{ address }}&nbsp;&nbsp;天气{{ deviceObj.weather }}&nbsp;&nbsp;{{ deviceObj.outerTem }}&nbsp;&nbsp;湿度{{ deviceObj.outerHum }}&nbsp;&nbsp;PM2.5:{{ deviceObj.outerPm }}{{ deviceObj.pm.unit }} 质量:{{ deviceObj.pm.mass }}
    </div>
    <div class="but-list">
      <div class="but-group" >
        <div class="icon suo" @click="childMethod"></div>
        <div class="text" @click="childMethod">童锁</div>
      </div>
      <div class="but-group" v-if="1===2">
        <div class="icon shop"></div>
        <div class="text">商城</div>
      </div>
      <div class="but-group">
        <div class="icon close" :class="{ active:isOpen === true  }"  @click="onOffMethod"></div>
        <div class="text"  @click="onOffMethod">开关</div>
      </div>
    </div>
    <div class="center">
      <div class="circle-data" :style="{ height:cHeight+'px' }">
        <div class="circle-inner">
          <p>
            PM2.5 <span>{{ deviceObj.pm.mass }}</span>
          </p>
          <p :class="{ active:  isOpen === true}">{{ deviceObj.pm.data }}</p>
          <p>{{ deviceObj.pm.unit }}</p>
        </div>
      </div>
      <div class="temper">
        <div class="t1">
          <p><span>{{ deviceObj.tem.data }}</span>&#176;c</p>
          <p><span style="font-size:16px">温度</span></p>
        </div>
        <div class="t2">
          <p><span>{{ deviceObj.hum.data }}</span>%</p>
          <p><span style="font-size:16px">湿度</span></p>
        </div>
      </div>
      <div class="tip">
        <p>滤芯剩余寿命{{ parseInt(deviceObj.screen.data / 3600) }}时</p>
        <p v-if="1===2">设备租赁剩余时间{{ parseInt(deviceObj.remain.data / 3600) }}时</p>
      </div>
      <div class="b-data">
        <span>CO2 <em>{{ deviceObj.co2.data }}</em> PPM</span>
        <span>TVOC <em>{{ deviceObj.tvoc.data }}</em> mg/m³</span>
        <span>甲醛 <em>{{ deviceObj.hcho.data }}</em> mg/m³</span>
      </div>
    </div>
    <div class="but-list fixed">
      <div class="but-group" @click="intiTime">
          <div class="icon time"></div>
          <div class="text">定时</div>
      </div>
      <div class="but-group" @click="switchModel()">
        <div class="icon model"></div>
        <div class="text">模式</div>
      </div>
      <div class="but-group" @click="switchSpeed()">
        <div class="icon shan"></div>
        <div class="text">风速</div>
      </div>
      <div class="but-group" @click="switchFunction()">
        <div class="icon menu"></div>
        <div class="text">功能</div>
      </div>
    </div>
    <yd-popup v-model="modeFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">模式设定</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in modeData" :key="index" :class="{ active: modeCurrent == index }" v-show="index != 0" @click="sendFunc(index,1)">
              <span>{{ item }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="speedFlag" position="bottom" width="90%" v-if="deviceObj.windItems.length === 1">
      <div class="content">
        <div class="title">风速设定</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in speedData" :key="index" :class="{ active: speedCurrent == index + 1 }" @click="sendFunc(index,2)">
              <span>{{ item }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="speedFlag" position="bottom" width="90%" v-else>
      <!--<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>-->
      <div class="content">
        <div class="title" style="position:relative;">
          风速设定
          <span style="position:absolute;right:0px;color:#3fa9f5" @click="saveSpeeed">保存</span>
        </div>
        <div class="list spec">
          <div style="float:left;width:50%;">
            <mt-picker :slots="slotsType" @change="onValuesChange1"></mt-picker>
          </div>
          <div style="float:right;width:50%;font-size:14px">
            <mt-picker :slots="slotsDw" @change="onValuesChange"></mt-picker>
          </div>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="functionFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">其它功能设定</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in functionData" :key="index" :class="{ active: item[0].value == 1 }" @click="selectFunction(index,item[0].value)">
              <span>{{ item[0].name }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <div class="child-suo" v-show="childItem === '1'">
      <img src="../../assets/ts.png"/>
      <span @click="childMethod(true)">点此解除锁屏</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { Popup } from 'vue-ydui/dist/lib.rem/popup'
import myUrl from 'common/js/api'
import { setWechatTitle } from 'utils'
import img1 from '../../assets/bak3.jpg' // 白天阴
import img2 from '../../assets/bak2.jpg' // 夜晚阴
import img3 from '../../assets/bak1.jpg' // 夜晚晴
import img4 from '../../assets/bak4.jpg' // 白天晴
import { Picker } from 'mint-ui'
export default {
  data () {
    return {
      specIndex: 0,
      specTypeIndex: 0, // 默认内风扇
      isFlag2: false,
      address: '',
      slotsType: [ // 风扇类型
        {
          defaultIndex: null,
          flex: 1,
          values: ['内风扇', '外风扇'],
          className: 'slot1',
          textAlign: 'left'
        }
      ],
      slotsDw: [ // 风扇挡位
        {
          defaultIndex: null,
          flex: 1,
          values: [],
          className: 'slot2',
          textAlign: 'right'
        }
      ],
      isFlag: false,
      img: '',
      currentBak: '',
      currentTime: 2,
      childItem: '0',
      timeSet: null,
      deviceName: '',
      cHeight: 200,
      isOpen: false,
      modeFlag: false, // 模式设置
      deviceObj: {},
      modeCurrent: null,
      modeData: [],
      speedFlag: false,
      speedCurrent: null,
      speedData: [],
      functionFlag: false,
      functionCurrent: null,
      functionData: [],
      weather: null,
      currentSpeed: []
    }
  },
  components: {
    'yd-popup': Popup,
    'mt-picker': Picker

  },
  created () {
    this.timeSet = setInterval(() => {
      if (this.currentTime === 0) {
        this.currentTime = 3
        this.getInfoData(true)
      }
      this.currentTime--
    }, 1000)
    this.cHeight = window.innerWidth * 0.45
    if (window.innerWidth <= 340) {
      this.cHeight = window.innerWidth * 0.45
    }
    this.getInfoData()
    this.deviceName = sessionStorage.getItem('name')
    setWechatTitle(this.deviceName, '')
  },
  computed: {
  },
  watch: {
    isOpen: function (val) {
      if (val) {
        this.img = this.currentBak
      } else {
        this.img = ''
      }
    }
  },
  mounted () {
  },
  methods: {
    saveSpeeed () {
      let currentValue = null
      this.speedData[this.specTypeIndex].choice.forEach((v, index) => {
        if (v === this.currentSpeed[0]) {
          currentValue = index
          this.speedData[this.specTypeIndex].value = index
        }
      })
      let data = {}
      data.deviceId = this.$route.query.deviceId
      data.funcId = this.speedData[this.specTypeIndex].type
      data.value = currentValue + 1
      // 发送指令
      this.$http.post(myUrl.sendFunc, data).then(res => {
        if (res.code === 200) {
          Loading.close()
          Toast({
            mes: '发送成功',
            timeout: 1500,
            icon: 'success'
          })
        }
      })
      .catch(error => {
        Loading.close()
      })
    },
    changeSpeed (item, index) {
      this.specIndex = index
      this.slots[0].values = item.choice
      this.slots[0].defaultIndex = parseInt(item.value) - 1
    },
    onValuesChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      this.currentSpeed = values
    },
    onValuesChange1 (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      if (values[0] == '内风扇') {
        this.specTypeIndex = 0
      } else {
        this.specTypeIndex = 1
      }
      this.slotsDw[0].values = this.speedData[this.specTypeIndex].choice
      this.slotsDw[0].defaultIndex = parseInt(this.speedData[this.specTypeIndex].value) - 1
    },
    intiTime () {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.$router.push({
        path: '/timinglist',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    switchModel () {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.modeFlag = true
    },
    switchSpeed () {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.speedFlag = true
    },
    switchFunction () {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.functionFlag = true
    },
    intoSet () {
      this.$router.push({
        path: '/set',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    childMethod (type) {
      if (!this.isOpen && type) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      let data = {}
      data.funcId = 270
      data.deviceId = this.$route.query.deviceId
      data.value = this.childItem === '1' ? 0 : 1
      this.$http.post(myUrl.sendFunc, data).then(res => {
        if (res.code === 200) {
          Loading.close()
          this.childItem = this.childItem === '1' ? '0' : '1'
          let tit = this.childItem === '1' ? '开启成功' : '关闭成功'
          Toast({
            mes: tit,
            timeout: 1500,
            icon: 'success'
          })
        }
      })
      .catch(error => {
        Loading.close()
      })
    },
    onOffMethod () {
      let data = {}
      data.funcId = 210
      data.deviceId = this.$route.query.deviceId
      data.value = this.isOpen ? 0 : 1
      this.$http.post(myUrl.sendFunc, data).then(res => {
        if (res.code === 200) {
          Loading.close()
          this.isOpen = !this.isOpen
          let tit = this.isOpen ? '开启成功' : '关闭成功'
          Toast({
            mes: tit,
            timeout: 1500,
            icon: 'success'
          })
        }
      })
      .catch(error => {
        Loading.close()
      })
    },
    selectMode (index) {
      this.modeCurrent = index
    },
    selectSpeed (index) {
      this.speedCurrent = index
    },
    selectFunction (index, value) {
      let data = {}
      data.deviceId = this.$route.query.deviceId
      data.funcId = this.functionData[index][0].type
      data.value = value === '0' ? '1' : '0'
      let tit = value === '0' ? '开启成功' : '关闭成功'
      this.$http.post(myUrl.sendFunc, data).then(res => {
        if (res.code === 200) {
          Loading.close()
          this.functionData[index][0].value = value === '0' ? '1' : '0'
          Toast({
            mes: tit,
            timeout: 1500,
            icon: 'success'
          })
        }
      })
      .catch(error => {
        Loading.close()
      })
    },
    getInfoData (type) {
      if (!type) {
        Loading.open('很快加载好了')
      }
      this.$http.get(myUrl.queryDetailByDeviceId + '?deviceId=' + this.$route.query.deviceId).then(res => {
        if (res.code === 200) {
          this.deviceObj = res.data
          this.weather = res.data.weather
          this.setWether()
          if (res.data.modeItem.value == 0) { // 开机
            this.img = ''
          } else {
            this.isOpen = true
          }
          if (res.data.location) {
            this.address = res.data.location.split(',')[1]
          }
          sessionStorage.setItem('location', res.data.location)
          sessionStorage.setItem('ip', res.data.ip)
          sessionStorage.setItem('deviceInfoItem', JSON.stringify(res.data.deviceInfoItem))
          sessionStorage.setItem('screens', JSON.stringify(res.data.screens))// 设置滤芯缓存
          this.childItem = res.data.childItem.value
          this.modeData = this.toArray(res.data.modeItem.choice)
          if (res.data.windItems.length === 1) {
            this.speedData = this.toArray(res.data.windItems[0].choice)
          } else if (res.data.windItems.length === 2) { // 内外风扇
            this.speedData = res.data.windItems
            this.speedData.forEach((v, index) => {
              v.name = index === 0 ? '内风扇' : '外风扇'
              v.choice = this.toArray(v.choice)
            })
            this.slotsDw[0].defaultIndex = parseInt(this.speedData[this.specTypeIndex].value) - 1
            this.slotsDw[0].values = this.speedData[0].choice
          }
          this.speedCurrent = res.data.windItems[0].value
          this.modeCurrent = res.data.modeItem.value
          this.functionData = res.data.funcs
          Loading.close()
        }
      })
      .catch(error => {
        Loading.close()
      })
    },
    // 发送指令
    sendFunc (index, type) {
      Loading.open('发送中...')
      let data = {}
      data.deviceId = this.$route.query.deviceId
      if (type === 1) { // 模式
        data.funcId = 210
        data.value = index
      } else if (type === 2) { // 风速
        data.funcId = 280
        data.value = index + 1
      }

      this.$http.post(myUrl.sendFunc, data).then(res => {
        if (type === 1) { // 模式
          this.modeCurrent = index
        } else if (type === 2) { // 风速
          this.speedCurrent = index + 1
        }
        if (res.code === 200) {
          Loading.close()
          Toast({
            mes: '发送成功',
            timeout: 1500,
            icon: 'success'
          })
        }
      })
      .catch(error => {
        Loading.close()
      })
    },
    setWether () {
      var myDate = new Date()
      let h = myDate.getHours()// 获取当前小时
      if (!this.weather) { // 未返回值
        if ((parseInt(h) < 6 && parseInt(h) >= 0) || (parseInt(h) < 24) && parseInt(h) > 18) { // 夜晚
          this.currentBak = img3
        } else { // 白天
          this.currentBak = img4
        }
      } else {
        if (this.weather.indexOf('雨') != -1 || this.weather.indexOf('阴') != -1) { // 阴天
          if ((parseInt(h) < 6 && parseInt(h) >= 0) || (parseInt(h) < 24) && parseInt(h) > 18) { // 夜晚
            this.currentBak = img2
          } else { // 白天
            this.currentBak = img1
          }
        } else {
          if ((parseInt(h) < 6 && parseInt(h) >= 0) || (parseInt(h) < 24) && parseInt(h) > 18) { // 夜晚
            this.currentBak = img3
          } else { // 白天
            this.currentBak = img4
          }
        }
      }
      this.img = this.currentBak
    },
    // 字符串转数组
    toArray (str) {
      let arr = []
      let newstr = str.split(',')
      for (let i = 0; i < newstr.length; i++) {
        arr.push(newstr[i].slice(2))
      }
      return arr
    }

  },
  destroyed () {
    clearInterval(this.timeSet)
  }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/common/scss/variable.scss";
  @import "src/common/scss/mixins.scss";
  .main-wrapper{
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: auto;
    top:0;
    bottom:0;
    background-color: #999999;
    color: #ffffff;
    transition-property: background-color;
    transition-duration: 0.3s;
    transition-timing-function: linear;
    .child-suo{
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0,0.6);
      text-align: center;
      & img{
        width: 20%;
        margin-top: 40%;
      }
      & span{
        position: absolute;
        bottom: 100px;
        left: 50%;
        margin-left: -42px;
        font-size: 14px;
        border: 1px solid #fff;
        border-radius:20px ;
        line-height: 32px;
        width: 110px;
      }
    }
    &.active{
      //background-color:-webkit-gradient(linear, 0 0, 0 top, from(#2689ed), to(rgba(30, 79, 251, 0.8)));
      //background-color: #21a6f7;
    }
    .info{
      padding-left: 15px;
      padding-right: 15px;
      /*overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;*/
      & img{
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    .header{
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
      position: relative;
      .time{
        position: absolute;
        left:15px;
        top:3px;
        color: #ffffff;
      }
      .edit{
        position: absolute;
        z-index: 999;
        right:15px;
        width: 20px;
        height: 20px;
        top:10px;
        background: url('../../assets/set.png') no-repeat center center;
        background-size:20px 20px;
      }
    }
    .content{
      padding: 20px 15px 20px 15px;
      color: #4d4d4d;
      .title{
        font-size: 16px;
        padding-bottom: 10px;
        border-bottom: 1px solid #dfdfdf;
      }
      .list{
        & ul li{
          font-size: 14px;
          margin-top: 20px;
          .icon{
            float: right;
            margin-right: 5px;
            width: 20px;
            height: 20px;
            border:1px solid #a3a3a3;
            border-radius: 100%;
          }
          &.active{
            .icon{
              background:url('../../assets/select.png') no-repeat center center;
              background-size:20px 20px;
              border:none;
            }
          }
        }
      }
      .spec{
        padding-left:10px;
        padding-right:10px;
        & ul li{
          &.active{
            color:#000;
            background: url('../../assets/left.png') no-repeat center right 60%;
            background-size: 20px 15px;
          }
        }
      }
    }
    .center{
      margin-top: 10px;
      .tip{
        text-align: center;
        margin-top: 10px;
        font-size: 12px;
        line-height: 20px;
      }
      .b-data{
        margin-top: 10px;
        font-size: 12px;
        text-align: center;
        & span{
          margin-right: 10px;
          & em{
            font-size: 18px;
          }
          &:last-child{
            margin-right: 0px;
          }
        }
      }
      .temper{
        width: 55%;
        margin: 0 auto;
        margin-top:10px;
        position: relative;
        overflow: hidden;
        &::before{
          content: '';
          position: absolute;
          width: 1px;
          height: 30px;
          background: #ffffff;
          left:50%;
          top:10px;
        }
        & div{
          width: 60px;
          text-align: center;
          font-size:14px;
          line-height: 24px;
          & span{
            font-size: 16px;
          }
        }
        .t1{
          float: left;
        }
        .t2{
          float: right;
        }
      }
      .circle-data{
        width: 45%;
        border:1px solid #ffffff;
        border-radius: 100%;
        @media only screen and (min-device-width : 320px)  and (max-device-width : 340px) {
          width: 45%;
        }

        margin: 0 auto;
        .circle-inner{
          width: 95%;
          height: 100%;
          border: 1px solid #ffffff;
          border-radius: 100%;
          margin: 0 auto;
          text-align:  center;
          & p:nth-child(1){
            margin-top: 30px;
            font-size: 24px;
          }
          & p:nth-child(2){
            font-size: 450%;
            font-weight: 600;
            color: #d86e5d;
            letter-spacing:5px;
            transition-property: color;
            transition-duration: 0.3s;
            transition-timing-function: linear;
            @media only screen and (min-device-width : 320px)  and (max-device-width : 340px) {
              font-size: 300%;
            }
            &.active{
              color: #5ddb5d;
            }
          }
        }
      }
    }
    .but-list{
      margin-top: 10px;
      display: flex;
      text-align: center;
      font-size:14px;
      @media only screen and (min-device-width : 320px)  and (max-device-width : 340px) {
        margin-top: 10px;
      }
      &.fixed{
        position: fixed;
        bottom: 10px;
        width: 100%;
      }
      .but-group{
        flex: 1;
        & .icon{
          width: 35px;
          height: 35px;
          border:1px solid #ffffff;
          border-radius: 100%;
          margin: 0 auto;
          margin-bottom: 5px;
          &.suo{
            background: url('../../assets/suo.png') no-repeat center center;
            background-size: 15px 20px;
          }
          &.shop{
            background: url('../../assets/cart.png') no-repeat center left 7px;
            background-size: 23px 18px;
          }
          &.close{
            background: url('../../assets/close.png') no-repeat center center;
            background-size: 18px 21px;
            //background-color:#20a8f8;
            border:1px solid #ffffff;
            &.active{
              border:1px solid #ffffff;
            }
          }
          &.time{
            background: url('../../assets/zhong.png') no-repeat center center;
            background-size: 21px 20px;
          }
          &.model{
            background: url('../../assets/modle.png') no-repeat center center;
            background-size: 17px 15px;
          }
          &.shan{
            background: url('../../assets/shan.png') no-repeat center top 6px;
            background-size: 22px 20px;
          }
          &.menu{
            background: url('../../assets/menu.png') no-repeat center center;
            background-size: 18px 16px;
          }
        }
      }
    }
  }




</style>

