<template>
  <div class="amap-page-container">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>授权管理</span>
    </div>
    <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" :events="events" class="amap-demo" :plugin="plugin">
      <el-amap-marker :position="marker.position" :events="events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
    </el-amap>
    <div class="toolbar">
      经纬度: [{{ center[0] }}, {{ center[1] }}] 地址: {{ address }}
    </div>
  </div>
</template>

<script>
// import { queryDevicePosition } from '../wenkong/api'
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'

export default {
  props: ['id'],
  data() {
    const self = this
    return {
      searchOption: {
        city: '上海',
        citylimit: true
      },
      zoom: 12,
      center: [121.59996, 31.197646],
      address: '',
      events: {
        click(e) {
          let { lng, lat } = e.lnglat
          const position = [lng, lat]
          self.center = position
          self.marker.position = position

          // // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress
                self.$nextTick()
              }
            }
          })

          Toast({
            mes: '位置设置成功！',
            timeout: 1500,
            icon: 'success'
          })
        }
      },
      marker: {
        position: [121.59996, 31.197646],
        visible: true,
        draggable: false
      },
      markers: [], // 多个标记
      plugin: {
        pName: 'Scale',
        events: {
          init(instance) {}
        }
      }
    }
  },
  methods: {
    queryDevicePosition(id) {
      queryDevicePosition(id).then(res => {
        const data = res.data
        if (!data.pointX || !data.pointY) {
          return
        }
        const position = [data.pointX, data.pointY]
        this.center = position
        this.marker.position = position
      })
    },
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push([poi.lng, poi.lat])
        })
        let center = [lngSum / pois.length, latSum / pois.length]
        this.center = center
        this.marker.position = center
      }
    },
    returnMethod() {
      this.$router.back(-1)
    }
  },
  watch: {
    id(val) {
      // this.queryDevicePosition(val)
    }
  },
  created() {
    // this.queryDevicePosition(this.id)
  }
}
</script>

<style lang='scss' scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.amap-page-container {
  height: 500px;
  position: relative;
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
  .search-box {
    margin: auto;
    margin-bottom: 10px;
  }
  .amap-demo {
    height: calc(100% - 40px);
    margin: 10px;
  }
  .toolbar {
    height: 40px;
    margin: 10px;
  }
}
</style>
