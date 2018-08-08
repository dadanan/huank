<template>
  <div class="we-page">
    <div class="we-header">
      <a class="we-back" href="/"><i class="iconfont icon-xiangzuojiantou"></i></a>
      电子净化
    </div>
    <div class="we-content">
      <div class="base-info-text">
        <span><i class="iconfont icon-weizhi vam"></i> 上海 嘉定</span>
        <span>晴 32℃</span>
        <span>湿度 62%</span>
        <span>PM2.5 32μg/m³</span>
      </div>
      <div class="control-btn-group">
        <div class="btn">
          <i class="iconfont icon-sheding"></i>
          <span>设定</span>
        </div>
        <div class="btn">
          <i class="iconfont icon-kaiguan"></i>
          <span>开关</span>
        </div>
      </div>
      <div class="data-show-container">
        <div class="data-show"></div>
        <div class="data1">
          <div class="data-template1">
            <span>PM2.5</span>
            <span>60</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data2">
          <div class="data-template1">
            <span>PM2.5</span>
            <span>23</span>
            <span>μg/m³</span>
          </div>
        </div>
        <div class="data3">
          <div class="data-template2">室外</div>
        </div>
        <div class="data4">
          <div class="data-template3">
            <span>62<span>%</span></span>
            <span>净化效率</span>
          </div>
        </div>
        <div class="data5">
          <div class="data-template4">室内</div>
        </div>
        <div class="data6">
          <div class="data-template5">
            <span><i class="iconfont icon-wendu"></i> 28<span>℃</span></span>
            <span><i class="iconfont icon-shidu"></i> 68<span>%</span></span>
          </div>
        </div>
        <div class="data7">
          <div class="data-template5">
            <span><i class="iconfont icon-wendu"></i> 30<span>℃</span></span>
            <span><i class="iconfont icon-shidu"></i> 65<span>%</span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="we-footer">
      <div class="func-sw">
        <i class="iconfont icon-jiare"></i>
        <yd-switch v-model="switch1"></yd-switch>
      </div>
      <div class="func-sw">
        <i class="iconfont icon-jiashi"></i>
        <yd-switch v-model="switch2"></yd-switch>
      </div>
      <div class="func-sw">
        <i class="iconfont icon-dianzijinghua"></i>
        <yd-switch v-model="switch3"></yd-switch>
      </div>
    </div>
  </div>
</template>

<script>
  import {Switch} from 'vue-ydui/dist/lib.rem/switch'

  export default {
    components: {
      'yd-switch': Switch
    },
    data () {
      return {
        switch1: true,
        switch2: true,
        switch3: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .we-page {
    height: 100vh;
    background-color: #2493f1;
    display: flex;
    flex-direction: column;
  }

  .we-header {
    position: relative;
    height: .85rem;
    background-color: #2493f1;
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

  .we-content {
    padding: .3rem .5rem;
    flex: 1;
    overflow: auto;
  }

  .we-footer {
    height: 2rem;
    background-color: #2493f1;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .5rem;
  }

  .control-btn-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1rem;
    /*padding: 0 .3rem;*/
    .btn {
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: .2rem;

      i {
        font-size: .65rem;
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
      align-items: center;
      span:nth-child(1) {
        font-size: .92rem;
        color: #ffff00;
        span {
          font-size: .23rem;
          color: #e6e6e6;
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
      right: 2.7rem;
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
