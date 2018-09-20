<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>授权管理</span>
    </div>
    <div class="config-wrapper">
      <p class="title">管理好友对设备的控制权限</p>
      <ul v-if="shareList.length">
        <li v-for="(item,index) in shareList" :key="index">
          <a class="img">
            <img :src="item.avatar" />
            <span>{{ item.nickname }}</span>
          </a>
          <span class="delete" @click="deleteMethod(item.openId)">删除</span>
        </li>
      </ul>
      <div v-else style="text-align:center;width:100%">暂无数据</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
import myUrl from 'common/js/api'
import Vue from 'vue'

export default {
  data() {
    return {
      inItems: [],
      outItems: [],
      isEdit: false,
      shareList: []
    }
  },
  created() {
    Loading.open('很快加载好了')
    setTimeout(() => {
      Loading.close()
    }, 300)
  },
  mounted() {
    this.getShareList()
  },
  methods: {
    returnMethod() {
      this.$router.back(-1)
    },
    deleteMethod(openid) {
      Loading.open('很快加载好了')
      this.$http
        .get(
          myUrl.clearRelation +
            '?deviceId=' +
            this.$route.query.deviceId +
            '&joinOpenId=' +
            openid
        )
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.getShareList()
          }
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    },
    getShareList() {
      Loading.open('很快加载好了')
      this.$http
        .get(myUrl.shareList + '?deviceId=' + this.$route.query.deviceId)
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.shareList = res.data
          }
        })
        .catch(error => {
          Loading.close()
          this.$toast(error.msg, 'bottom')
        })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.set-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
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
  .config-wrapper {
    position: absolute;
    top: 40px;
    bottom: 0px;
    height: auto;
    //background: #ffffff;
    left: 0;
    width: 100%;
    .title {
      padding: 15px;
    }
    & ul li {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #ffffff;
      padding-left: 15px;
      padding-right: 15px;
      margin-bottom: 10px;
      font-size: 14px;
      & a {
        float: left;
        & img {
          width: 20px;
          height: 20px;
          margin-top: 5px;
          vertical-align: top;
        }
        & span {
          margin-left: 10px;
        }
      }
      & .delete {
        float: right;
        font-size: 16px;
        color: #999999;
      }
    }
  }
}
</style>

