<template>
  <div class='index-container' :class="{ cold: currentOption == 0,hot: currentOption == 1,wind: currentOption == 2 }">
    <div class='header'>
      <img src='@/assets/arrow_left.png'>
      <span>{{pageName}}</span>
      <img class='setting' @click='intoSet' src='@/assets/set.png'>
    </div>
    <div class='info'>
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;&nbsp;
      <span v-if='formatItemsList[9].showStatus'>{{location}}&nbsp;&nbsp;</span>
      <span v-if='formatItemsList[10].showStatus'>{{weather}} {{outerTem}}&nbsp;&nbsp;</span>
      <span v-if='formatItemsList[11].showStatus'>湿度: {{outerHum}}&nbsp;&nbsp;</span>
      <span v-if='formatItemsList[12].showStatus'>PM2.5: {{outerPm}}ug/m3</span>
    </div>
    <div class='switch'>
      <div v-if='formatItemsList[7].showStatus'>
        <div class='left'>
          <yd-switch v-model="switch1" ref='switch'></yd-switch>
        </div>
        <p>{{formatItemsList[7].showName}}</p>
      </div>
      <div v-if='formatItemsList[8].showStatus'>
        <div>
          <img src='@/assets/wenkong_close.png'>
        </div>
        <p>{{formatItemsList[8].showName}}</p>
      </div>
    </div>
    <div class='main'>
      <div>
        <h3>设定值</h3>
        <h1>{{temperature}}</h1>
        <h3 class='last'>℃</h3>
      </div>
    </div>
    <div class='current-info'>
      <p v-if='formatItemsList[4].showStatus'>
        {{formatItemsList[4].showName}}
        <span class='strong'>{{temperature}}</span>
        ℃
      </p>
      <p v-if='formatItemsList[5].showStatus'>
        {{formatItemsList[4].showName}}
        <span class='strong'>80</span>
        %
      </p>
    </div>
    <div class='function' v-if='formatItemsList[3].showStatus'>
      <div v-for='item in functionList' @click='functionClicked(item)' :class="{able: item.able}" :key='item.id'>
        <span>{{item.definedName}}</span>
      </div>
    </div>
    <div class='menu'>
      <div @click='modelClickedHandler(formatItemsList[0].ablityId,0)' v-if='formatItemsList[0].showStatus'>
        <div>
          <img class='first' src='@/assets/temperature.png'>
        </div>
        <span>{{formatItemsList[0].showName}}</span>
      </div>
      <div @click='modelClickedHandler(formatItemsList[1].ablityId,1)' v-if='formatItemsList[1].showStatus'>
        <div>
          <img src='@/assets/model.png'>
        </div>
        <span>{{formatItemsList[1].showName}}</span>
      </div>
      <div @click='modelClickedHandler(formatItemsList[2].ablityId,2)' v-if='formatItemsList[2].showStatus'>
        <div>
          <img class='third' src='@/assets/wind.png'>
        </div>
        <span>{{formatItemsList[2].showName}}</span>
      </div>
    </div>
    <div class='left-side' v-if='formatItemsList[6].showStatus'>
      <div>
        <img class='first' src='@/assets/wind.png'>
        <span>{{windData.deviceModelAblityOptions && windData.deviceModelAblityOptions[currentOptionForWind].definedName}}</span>
      </div>
      <div>
        <img class='second' src='@/assets/model.png'>
        <span>{{modelData.deviceModelAblityOptions && modelData.deviceModelAblityOptions[currentOption].definedName}}</span>
      </div>
    </div>
    <!-- 模式 -->
    <yd-popup v-model="modelVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">{{modelData.definedName}}</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in modelData.deviceModelAblityOptions" :key="index" :class="{ active: currentOption == index }" @click='modelClicked(index,item)'>
              <span>{{ item.definedName }}</span>
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
            <li v-for="(item,index) in windData.deviceModelAblityOptions" :key="index" :class="{ active: currentOptionForWind == index }" @click='modelClicked(index,item,3)'>
              <span>{{ item.definedName }}</span>
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
import { Switch } from 'vue-ydui/dist/lib.rem/switch'
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getToken,
  getLocation,
  getWeather
} from './api'
import Store from './store'

let json = require('./test')
json = json.data
const formatItemsList = json.formatItemsList
const abilitysList = json.abilitysList

export default {
  data() {
    return {
      switch1: true,
      modelVisible: false, //
      windVisible: false, //
      temperatureVisible: false, // 显示温度设定弹框
      temperature: 26, // 设定温度
      currentOption: 0, // 模式的当前选择项
      currentOptionForWind: 0, // 风速的当前选择项
      windModel: true, // 用户点击了风速模块?
      modelData: {},
      windData: {},
      functionList: [],
      pageName: json.pageName,
      formatItemsList: formatItemsList,
      location: '',
      weather: '',
      outerTem: '',
      outerHum: '', // 湿度
      outerPm: '' // PM2.5
    }
  },
  methods: {
    setModelData(id, index) {
      const data = abilitysList.filter(item => item.ablityId === id)[0]
      index === 1 ? (this.modelData = data) : (this.windData = data)
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
    },
    reduce() {
      this.temperature -= 1
    },
    intoSet() {
      this.$router.push({
        path: '/wenkongset',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    modelClicked(index, data, which) {
      if (which === 3) {
        this.currentOptionForWind = index
      } else {
        this.currentOption = index
      }
      // 发送指令，指令应该在data里
    },
    functionClicked(item) {
      this.functionList.forEach(list => {
        list['able'] = false
      })
      item['able'] = true
    },
    getIndexAblityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: 435, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          this.getIndexFormatData(res.data)
        }
      })
    },
    getIndexFormatData(list) {
      // 获取H5控制页面功能项数据，带isSelect参数
      newQueryDetailByDeviceId({
        deviceId: 435,
        abilityIds: list.formatItemsList.map(item => item.abilityId)
      }).then(res => {
        const data = res.data
        // 将res.data中的isSelect和dirValue赋值过去
        list.abilitysList.forEach((item, index) => {
          if (!item.abilityOptionList || item.abilityOptionList.length === 0) {
            return
          }
          item.ablityType !== 1 &&
            item.abilityOptionList.forEach((option, oIndex) => {
              const temp = Object.assign(
                option,
                data[index].abilityOptionList[oIndex]
              )
            })
        })
      })
    },
    getToken() {
      // 高级设置Token
      getToken({ customerId: 12, password: 123456 }).then(res => {
        Store.save('Token', res.data)
      })
    },
    getLocation() {
      getLocation(435).then(res => {
        this.location = res.data.location
      })
    },
    getWeather() {
      getWeather(435).then(res => {
        const data = res.data

        this.weather = data.weather
        this.outerTem = data.outerTem
        this.outerPm = data.outerPm
        this.outerHum = data.outerHum
      })
    }
  },
  created() {
    this.getToken()

    // 功能项数据赋值
    const tempArray = abilitysList.filter(
      item => item.ablityId === this.formatItemsList[3].ablityId
    )[0].deviceModelAblityOptions
    tempArray.forEach(item => {
      item['able'] = false
    })
    this.functionList = tempArray

    this.getIndexAblityData()
    this.getLocation()
    this.getWeather()
  },
  mounted() {
    const containerWidth = document.querySelector('.left').offsetWidth
    const switchElement = this.$refs.switch.$el
    const switchWidth = switchElement.offsetWidth

    // 动态改变开关的left属性，以保持一直水平居中
    switchElement.style.left = (containerWidth - switchWidth) / 2 + 'px'
  },
  components: {
    'yd-popup': Popup,
    'mt-picker': Picker,
    [Switch.name]: Switch
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
        color: white;
        font-size: 15px;
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
</style>

