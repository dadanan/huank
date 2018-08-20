<template>
  <div class='index-container'>
    <div class='header'>
      <img src='@/assets/arrow_left.png'>
      <span>温控器</span>
      <img class='setting' @click='intoSet' src='@/assets/set.png'>
    </div>
    <div class='info'>
      <img src="../../assets/map.png" style="width:12px;height:auto" />
      <span>上海</span>&nbsp;&nbsp;
      <span>嘉定</span>&nbsp;&nbsp;
      <span>晴</span>&nbsp;&nbsp;
      <span>32℃</span>&nbsp;&nbsp;
      <span>湿度62%</span>&nbsp;&nbsp;
      <span>PM2.5：32ug/m³</span>
    </div>
    <div class='switch'>
      <div>
        <div class='left'>
          <yd-switch v-model="switch1" ref='switch'></yd-switch>
        </div>
        <p>主机状态</p>
      </div>
      <div>
        <div>
          <img src='@/assets/wenkong_close.png'>
        </div>
        <p>开关</p>
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
      <p>
        当前温度
        <span class='strong'>{{temperature}}</span>
        ℃
      </p>
      <p>
        当前湿度
        <span class='strong'>80</span>
        %
      </p>
    </div>
    <div class='menu'>
      <div @click='modelClickedHandler(0)'>
        <div>
          <img class='first' src='@/assets/temperature.png'>
        </div>
        <span>温度</span>
      </div>
      <div @click='modelClickedHandler(1)'>
        <div>
          <img src='@/assets/model.png'>
        </div>
        <span>模式</span>
      </div>
      <div @click='modelClickedHandler(2)'>
        <div>
          <img class='third' src='@/assets/wind.png'>
        </div>
        <span>风速</span>
      </div>
      <div @click='modelClickedHandler(3)'>
        <div>
          <img src='@/assets/function.png'>
        </div>
        <span>功能</span>
      </div>
    </div>
    <yd-popup v-model="modelVisible" position="bottom" width="90%">
      <div class="content">
        <div class="title">{{modelData[whichModel].title}}</div>
        <div class="list">
          <ul>
            <li v-for="(item,index) in modelData[whichModel].option" :key="index" :class="{ active: currentOption == index }" @click='currentOption = index'>
              <span>{{ item }}</span>
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
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { Popup } from 'vue-ydui/dist/lib.rem/popup'
import { Picker } from 'mint-ui'
import { Switch } from 'vue-ydui/dist/lib.rem/switch'
export default {
  data() {
    return {
      switch1: true,
      modelVisible: false, // 显示弹窗（除温度设定）
      temperatureVisible: false, // 显示温度设定弹框
      temperature: 26, // 设定温度
      currentOption: 0, // select 当前选择项
      whichModel: 1, // 用户点击了哪个模块
      modelData: {
        1: {
          title: '模式设定',
          option: ['睡眠模式', '手动模式', '智能模式']
        },
        2: {
          title: '风俗设定',
          option: ['低速', '中速', '高速', '自动']
        },
        3: {
          title: '功能设定',
          option: ['制冷', '制热', '除湿']
        }
      }
    }
  },
  methods: {
    modelClickedHandler(which) {
      if (which) {
        this.modelVisible = true
        this.whichModel = which
        return
      }
      this.temperatureVisible = true
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
    }
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
  background-image: url('~@/assets/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  .header {
    box-sizing: border-box;
    margin: tvw(110) tvw(162) auto tvw(162);
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
    margin: tvw(229) auto tvw(234) auto;
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
    margin-top: tvw(350);
    margin-bottom: tvw(700);
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
  .menu {
    width: tvw(2485);
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: tvw(131);
    left: tvw(295);
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
}
</style>

