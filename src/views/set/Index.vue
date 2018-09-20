<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>设备设置</span>
    </div>
    <div class="set-cell">
      <div class="cell-item border-bottom" @click="editDevFlag = true">
        <div class="cell-left">
          <span>设备名称</span>
        </div>
        <div class="cell-right">
          <span>{{ getDevice() }}</span>
        </div>
      </div>
      <div class="cell-item border-bottom" @click="intoInfo">
        <div class="cell-left">
          <span>设备信息</span>
        </div>
        <div class="cell-right">
          <span>{{ modelName }}</span>
        </div>
      </div>

      <div class="cell-item border-bottom" @click="intoShare">
        <div class="cell-left">
          <span>共享授权</span>
        </div>
      </div>

      <div class="cell-item" @click="intoPermissions">
        <div class="cell-left">
          <span>授权管理</span>
        </div>
      </div>

      <div class="cell-item white" @click="intoData">
        <div class="cell-left">
          <span>数据曲线图</span>
        </div>
        <div class="cell-right"></div>
      </div>
      <div class="cell-item white" @click.stop="show2 = true">
        <div class="cell-left">
          <span>手动设置位置</span>
        </div>
        <div class="cell-right">
          <span style="color:rgb(63, 169, 245)">{{ model2 }}
            <!--{{ (batteryList[0].value/3600).toFixed(2) }}h-->
          </span>
        </div>
      </div>
      <div class="cell-item white" @click="intoBattery">
        <div class="cell-left">
          <span>滤芯寿命</span>
        </div>
        <div class="cell-right">
          <span></span>
        </div>
      </div>
      <div class="cell-item white" v-if="1===2">
        <div class="cell-left">
          <span>固件升级</span>
        </div>
        <div class="cell-right"></div>
      </div>
      <div class="cell-item white" @click="intoConfig">
        <div class="cell-left">
          <span>设备配置</span>
        </div>
        <div class="cell-right"></div>
      </div>
      <div class="cell-item white">
        <a href="tel:88888888">
          <div class="cell-left">
            <span>联系客服</span>
          </div>
          <div class="cell-right"></div>
        </a>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="editDevFlag">
      <div class="confirm">
        <div class="confim-top">
          <textarea class="name" placeholder="输入新设备的名称" v-model="deviceName"></textarea>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="editDevFlag = false">取消</div>
          <div class="but create" @click="editDev">确定</div>
        </div>
      </div>
    </div>
    <yd-cityselect v-model="show2" ref="cityselectDemo" :callback="result2" :items="district" :provance="province" :city="city" :area="area"></yd-cityselect>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import District from 'ydui-district/dist/jd_province_city_area_id'
import myUrl from 'common/js/api'
import { CitySelect } from 'vue-ydui/dist/lib.rem/cityselect'
import Store from '../wenkong/store'

export default {
  data() {
    return {
      province: '',
      city: '',
      area: '',
      switch1: false,
      switch2: false,
      editDevFlag: false,
      deviceName: '',
      modelName: '',
      batteryList: [],
      show2: false,
      model2: '',
      district: District
    }
  },
  created() {
    Loading.open('很快加载好了')
    if (Store.fetch('location')) {
      this.model2 = Store.fetch('location')
      let arr = this.model2.split(',')
      if (arr.length === 3) {
        this.province = arr[0]
        this.city = arr[1]
        this.area = arr[2]
      }
    }
    if (Store.fetch('screens')) {
      this.batteryList = JSON.parse(Store.fetch('screens'))
    }
    setTimeout(() => {
      Loading.close()
    }, 300)
  },
  components: {
    'yd-cityselect': CitySelect
  },
  mounted() {
    this.modelName = Store.fetch('model')
  },
  methods: {
    result2(ret) {
      this.model2 = ret.itemName1 + ',' + ret.itemName2 + ',' + ret.itemName3
      // 发送服务端
      Loading.open('很快加载好了')
      this.$http
        .get(
          myUrl.updateDeviceLocation +
            '?deviceId=' +
            this.$route.query.deviceId +
            '&location=' +
            this.model2
        )
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            sessionStorage.setItem('location', this.model2)
          }
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    },
    returnMethod() {
      this.$router.back(-1)
    },
    intoShare() {
      this.$router.push({
        path: '/share',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    intoPermissions() {
      this.$router.push({
        path: '/permissions',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    intoConfig() {
      this.$router.push({
        path: '/config',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    intoBattery() {
      this.$router.push({
        path: '/battery',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    intoData() {
      this.$router.push({
        path: '/data',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    editDev() {
      Loading.open('很快加载好了')
      this.$http
        .get(
          myUrl.editDevice +
            '?deviceId=' +
            this.$route.query.deviceId +
            '&deviceName=' +
            this.deviceName
        )
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.editDevFlag = false
            sessionStorage.setItem('name', this.deviceName)
            this.getDevice()
          }
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    },
    intoInfo() {
      this.$router.push({
        path: '/devinfo',
        query: {
          deviceId: this.$route.query.deviceId
        }
      })
    },
    getDevice() {
      return Store.fetch('name')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.set-wrapper {
  .dialog {
    position: fixed;
    z-index: 2000;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    .confirm {
      width: 80%;
      background-color: #ffffff;
      border-radius: 5px;
      font-size: 15px;
      animation: zoom-in 0.15s ease forwards;
      .confim-top {
        padding-top: 20px;
        padding-bottom: 20px;
        background: #2689ee;
        color: #ffffff;
        text-align: center;
        position: relative;
        overflow: hidden;
        .name {
          text-align: left;
          width: 100%;
          padding-left: 15px;
          padding-right: 15px;
          background: none;
          float: left;
          border: none;
          color: #93c4f7;
          font-size: 14px;
          min-height: 50px;
        }
        & p {
          line-height: 24px;
          &:nth-child(1) {
            font-size: 16px;
            margin-bottom: 5px;
          }
        }
        & ul {
          width: 205px;
          margin: 0 auto;
          & li {
            text-align: left;
            & p {
              display: inline-block;
              text-align: left;
              font-size: 14px !important;
              margin-bottom: 0px !important;
            }
          }
        }
      }
      .confim-bottom {
        background: #ffffff;
        padding: 20px 20px;
        position: relative;
        overflow: hidden;
        font-size: 14px;
        .but {
          width: 46%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #2689ee;
          color: #2689ee;
          border-radius: 5px;
          float: left;
          &:nth-child(2) {
            float: right;
            &.create {
              background: #2689ee;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    position: relative;
    .return {
      position: absolute;
      left: 0px;
      background: url('../../assets/arr-left.png') no-repeat center center;
      background-size: 8px 16px;
      width: 40px;
      height: 40px;
      display: block;
      top: 0px;
    }
  }
  .set-cell {
    margin-top: 10px;
    .cell-item {
      position: relative;
      display: flex;
      overflow: hidden;
      margin-bottom: 20px;
      font-size: 14px;
      &.white {
        background: #ffffff;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        .cell-right {
          &::after {
            top: 16px;
          }
        }
      }
      &.border-bottom {
        padding-bottom: 15px;
        &::after {
          content: '';
          margin-left: 15px;
          position: absolute;
          z-index: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          border-bottom: 1px solid #d9d9d9;
          transform: scaleY(0.5);
          transform-origin: 0 0;
        }
      }
      .cell-left {
        padding-left: 15px;
        display: flex;
        align-items: center;
      }
      .cell-right {
        flex: 1;
        justify-content: flex-end;
        text-align: right;
        padding-right: 40px;
        &::after {
          display: block;
          color: #c9c9c9;
          content: '';
          width: 8px;
          height: 15px;
          background: url('../../assets/arr-right.png') no-repeat center center;
          background-size: 8px 15px;
          position: absolute;
          right: 20px;
          top: 3px;
        }
        & span {
          color: #999999;
        }
      }
    }
  }
}
</style>

