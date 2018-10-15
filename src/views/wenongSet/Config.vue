<template>
  <div class="set-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>设备配置</span>
      <span class="edit" @click="save" v-if="isEdit">保存</span>
      <span class="edit" @click="edit" v-else>编辑</span>
    </div>
    <!--<div class="config-wrapper">
      <div class="cell-header">
        <div class="cell-value"><b>配置信息</b></div>
        <div class="cell-value"><b>配置值</b></div>
        <div class="cell-value"><b>默认值</b></div>
      </div>
      <div>
      <div class="cell-content" v-for="(item,index) in inItems">
        <div class="cell-txt">(内)风速{{ item.level }}档</div>
        <div class="cell-txt">
          <span v-if="!isEdit">{{ item.speed }}</span>
          <input v-else v-model="item.speed" style="width:50px;"/> RPM
        </div>
        <div class="cell-txt"></div>
      </div>
      <div class="cell-content" v-for="(item,index) in outItems">
        <div class="cell-txt">(外)风速{{ item.level }}档</div>
        <div class="cell-txt">
          <span v-if="!isEdit">{{ item.speed }}</span>
          <input v-else v-model="item.speed" style="width:50px;"/> RPM
        </div>
        <div class="cell-txt"></div>
      </div>
      </div>
    </div>-->
    <yd-accordion style="background: none;">
      <yd-accordion-item title="转速配置">
        <div slot="txt" style="color:#20aaf8; position: absolute; right: 30px;">保存</div>
        <div style="padding: .24rem; background: #f2f2f2; ">
          <table class="table">
            <tr>
              <th>档位</th>
              <th>转数</th>
              <th>默认值</th>
            </tr>
            <tr>
              <td>1挡</td>
              <td>450</td>
              <td>400</td>
            </tr>
          </table>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="智能逻辑设置">
        <div style="padding: .24rem;">
          <!-- <p>岱宗夫如何，齐鲁青未了。</p>
          <p>造化钟神秀，阴阳割昏晓。</p>
          <p>荡胸生层云，决眦入归鸟。</p>
          <p>会当凌绝顶，一览众山小。</p> -->
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="智能算法设置">
        <div style="padding: .24rem;background: #f2f2f2; ">
          <yd-checkbox-group v-model="checkbox2">
            <yd-checkbox val="1">云端大数据联动</yd-checkbox>
            <yd-checkbox val="2">神经网络算法</yd-checkbox>
            <yd-checkbox val="3">模糊驱动算法</yd-checkbox>
            <yd-checkbox val="4">深度学习算法</yd-checkbox>
          </yd-checkbox-group>
          <p style="color: #b3b3b3;">*注：算法依赖于大量数据，不断完善</p>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="关联属性设置">
        <div style="padding: .24rem;background: #f2f2f2;">
          <img src="../../assets/gl.png" style="width: 100%;" />
          <yd-radio-group v-model="radio1" style="text-align: center; margin-top: 15px;" size='16'>
            <yd-radio val="1">
              <span style="font-size: 12px; ">设置关联</span>
            </yd-radio>
            <yd-radio val="2">
              <span style="font-size: 12px;">设置非关联</span>
            </yd-radio>
          </yd-radio-group>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="主从设置">
        <div style="padding: .24rem;background: #f2f2f2;">
          <div>
            <span>组网设置:</span>
            <div class="switch-box" style="display: inline-block; margin-left: 20px; vertical-align: middle;">
              <span style="vertical-align: middle;">{{switch1 === true ? '主设备': '从设备' }}</span>
              <span style="vertical-align: middle;" @click="switch1=!switch1">
                <img src="../../assets/switch.png" style="height: 20px;vertical-align: middle" v-if="!switch1" />
                <img src="../../assets/switch2.png" style="height: 20px;vertical-align: middle" v-if="switch1" />
              </span>
            </div>
            <span style="float: right; color: #6fbff8; margin-left: 10px;" @click='delDev()' v-show='switch1'>删除</span>
            <span style="float: right; color: #6fbff8;" @click='addDev()' v-show='switch1'>+添加从设备</span>
          </div>
          <table class="table" style="margin-top: 5px;">
            <tr>
              <th>序号</th>
              <th>名称</th>
              <th>地址</th>
            </tr>
            <tr v-for='(item,index) in childDeviceArray' :key='item.id'>
              <td>{{index + 1}}</td>
              <td>{{item.deviceName}}</td>
              <td>{{item.childId}}</td>
            </tr>
          </table>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="设备个性设置">
        <div style="padding: .24rem;background: #f2f2f2;">
          <ul class="imglist">
            <li><img src="../../assets/dev.png" /></li>
          </ul>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="软件更新">
        <div style="padding: .24rem;background: #f2f2f2;">
          <yd-timeline>
            <yd-timeline-item>
              <p>出厂版本</p>

            </yd-timeline-item>

          </yd-timeline>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="恢复出厂设置">
        <div style="padding: .24rem; background: #f2f2f2;">
          <p style="color: #4d4d4d;">设置只针对高级设备配置选项内的参数设置部份，如需要软件退档类操作，恢复出厂设置是无了效的，望知悉！</p>
          <p style="color: #4d4d4d;">您确认需要恢复吗？恢复后，设置的参数将被清除重置！</p>
          <span class="comfirmBtn" style="height: 30px; width: 85px; background: #ff1d25; border-radius: 5px; display: block;margin: 10px auto;">确认恢复</span>
        </div>
      </yd-accordion-item>
      <yd-accordion-item title="帮助文件">
        <div style="padding: .24rem;background: #f2f2f2;">
          <table class="table2">
            <tr>
              <td>设备接线与安装</td>
              <td>查看</td>
              <td>
                <a href="#">下载</a>
              </td>
            </tr>
          </table>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <div class="create-dialog dialog" v-if="setPwdFlag">
      <div class="confirm">
        <div class="confim-top">
          <p>请输入设备密码</p>
          <input type="number" name="" id="" value="" v-model="pwd" style="position: absolute; top:50px; left: 20px; right: 0; height: 40px; opacity: 0;" />
          <div class="flex flex-pack-justify" style="margin: 0 20px;">
            <span class="box">{{pwdList[0]}}</span>
            <span class="box">{{pwdList[1]}}</span>
            <span class="box">{{pwdList[2]}}</span>
            <span class="box">{{pwdList[3]}}</span>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="setPwdFlag = false">取消</div>
          <div class="but create" @click="getToken">确定</div>
        </div>
      </div>
    </div>
    <div class="create-dialog dialog" v-if="delDevFlag">
      <div class="confirm" style="padding: 0;">
        <div class="confim-top" style="text-align: left; color: #fff; padding: 0 10px 10px; ">
          <p style="padding-top:10px ;">请选择你需要删除的从设备：</p>
          <div>
            <yd-radio-group color="#00ff00" v-model="deleteTheDevice">
              <yd-radio v-for='item in childDeviceArray' :key='item.id' :val="item.id">
                <span style="color: #fff ">{{item.deviceName}}</span>
              </yd-radio>
            </yd-radio-group>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="delDevFlag = false">取消</div>
          <div class="but create" @click="deleteChildDevice">确定</div>
        </div>
      </div>
    </div>

    <div class="create-dialog dialog" v-if="addDevFlag">
      <div class="confirm" style="padding: 0;">
        <div class="confim-top" style="text-align: left; color: #fff; padding:20px 10px; ">
          <div class="flex flex-align-center">
            <label>设备名称:</label>
            <input v-model='deviceName' type="text" class="flex-1" style="background: #fff; border-radius: 5px; border: none; line-height: 30px;" />
          </div>
          <div class="flex flex-align-center" style="margin-top: 10px;">
            <label>设备地址:</label>
            <input v-model='deviceChildId' type="text" class="flex-1" style="background: #fff; border-radius: 5px; border: none; line-height: 30px;" />
          </div>
          <div class="flex flex-align-center" style="margin-top: 10px;">
            <label>设备型号:</label>
            <select class='select' v-model='modelSelected'>
              <option v-for='item in modelList' :key='item.id' :value='item.id'>{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="confim-bottom">
          <div class="but" @click="addDevFlag = false">取消</div>
          <div class="but create" @click="createChildDevice">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Alert, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import myUrl from 'common/js/api'
import Vue from 'vue'
import { Accordion, AccordionItem } from 'vue-ydui/dist/lib.rem/accordion'
import { CheckBox, CheckBoxGroup } from 'vue-ydui/dist/lib.rem/checkbox'
import { Radio, RadioGroup } from 'vue-ydui/dist/lib.rem/radio'
import { TimeLine, TimeLineItem } from 'vue-ydui/dist/lib.rem/timeline'
import { Switch } from 'vue-ydui/dist/lib.rem/switch'
import {
  childDeviceList,
  getToken,
  addChildDevice,
  delChildDevice,
  modelList
} from '../wenkong/api'
import Store from '../wenkong/store'

export default {
  data() {
    return {
      inItems: [],
      outItems: [],
      isEdit: false,
      open: 0,
      checkbox2: [],
      radio1: 1,
      switch1: true,
      setPwdFlag: true,
      delDevFlag: false,
      addDevFlag: false,
      pwd: '',
      pwdList: [],
      childDeviceArray: [],
      modelList: [],
      modelSelected: '1',
      deviceChildId: '',
      deviceId: '',
      deviceName: '',
      deleteTheDevice: ''
    }
  },
  methods: {
    createChildDevice() {
      addChildDevice({
        hostDeviceId: this.deviceId,
        childId: this.deviceChildId,
        deviceName: this.deviceName,
        modelId: this.modelSelected
      })
        .then(res => {
          Toast({
            mes: '添加成功！',
            timeout: 1500,
            icon: 'success'
          })
          this.childDeviceArray.push({
            deviceName: this.deviceName,
            childId: this.deviceChildId,
            id: res.data
          })
          this.addDevFlag = false
        })
        .catch(err => {
          Alert({
            mes: `添加失败：${err.msg}`
          })
        })
    },
    deleteChildDevice() {
      delChildDevice(this.deleteTheDevice)
        .then(res => {
          Toast({
            mes: '删除成功！',
            timeout: 1500,
            icon: 'success'
          })
          this.childDeviceArray = this.childDeviceArray.filter(
            item => item.id !== this.deleteTheDevice
          )
          this.delDevFlag = false
        })
        .catch(err => {
          Alert({
            mes: `删除失败：${err.msg}`
          })
        })
    },
    returnMethod() {
      this.$router.back(-1)
    },
    getConfigInfo() {
      Loading.open('很快加载好了')
      this.$http
        .post(myUrl.getSpeedConfig + '?deviceId=' + this.deviceId)
        .then(res => {
          if (res.code === 200) {
            Loading.close()
            this.inItems = res.data.inItems
            this.outItems = res.data.outItems
          }
        })
        .catch(error => {
          Loading.close()
        })
    },
    save() {
      Loading.open('很快加载好了')
      let data = {}
      data.deviceId = this.deviceId
      data.inSpeed = []
      this.inItems.forEach(v => {
        data.inSpeed.push(v.speed)
      })
      data.outSpeed = []
      this.outItems.forEach(v => {
        data.outSpeed.push(v.speed)
      })
      this.$http
        .post(myUrl.setSpeedConfig, data)
        .then(res => {
          if (res.code === 200) {
            this.isEdit = false
            Loading.close()
            this.getConfigInfo()
            Toast({
              mes: '设置成功',
              timeout: 1500,
              icon: 'success'
            })
          }
        })
        .catch(error => {
          Loading.close()
        })
    },
    edit() {
      this.isEdit = true
    },
    addDev() {
      this.addDevFlag = true
    },
    delDev() {
      this.delDevFlag = true
    },
    childDeviceList() {
      childDeviceList(this.deviceId).then(res => {
        this.childDeviceArray = res.data
      })
    },
    getToken() {
      console.log('密码:', this.pwdList.join(''))
      // 高级设置Token
      getToken({
        customerId: Store.fetch('customerId'),
        password: this.pwdList.join('')
      }).then(res => {
        if (res.code === 200 && res.data) {
          Store.save('Token', res.data)
          this.childDeviceList()
          this.getModelList()
          this.setPwdFlag = false
        }
      })
    },
    getModelList() {
      modelList(Store.fetch('customerId')).then(res => {
        this.modelList = res.data
        this.modelSelected = res.data[0].id
      })
    }
  },
  created() {
    Loading.open('很快加载好了')
    setTimeout(() => {
      Loading.close()
    }, 300)
    this.deviceId = this.$route.query.deviceId
  },
  components: {
    'yd-accordion': Accordion,
    'yd-accordion-item': AccordionItem,
    'yd-checkbox-group': CheckBoxGroup,
    'yd-checkbox': CheckBox,
    'yd-radio-group': RadioGroup,
    'yd-radio': Radio,
    'yd-timeline-item': TimeLineItem,
    'yd-timeline': TimeLine,
    'yd-switch': Switch
  },
  watch: {
    pwd: function() {
      if (this.pwd && this.pwd.length > 0) {
        if (this.pwd.length >= 4) {
          this.pwd = this.pwd.slice(0, 4)
        }
        this.pwdList = this.pwd.split('')
      } else {
        this.pwdList = []
      }
    }
  },
  mounted() {
    this.getConfigInfo()
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
  .box {
    height: 40px;
    width: 40px;
    border: 1px solid #fff;
    display: block;
    line-height: 40px;
  }
  .flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flex-v {
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .flex-1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .flex-align-center {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .flex-pack-center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .flex-pack-justify {
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
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
      overflow: hidden;
      animation: zoom-in 0.15s ease forwards;
      .confim-top {
        padding-top: 20px;
        padding-bottom: 20px;
        background: #2689ee;
        color: #ffffff;
        text-align: center;
        position: relative;
        overflow: hidden;
        .title {
          line-height: 35px;
          font-size: 16px;
          font-weight: normal;
          border-bottom: 1px solid #6fa7f1;
        }
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
          min-height: 100px;
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
    .edit {
      position: absolute;
      right: 15px;
    }
  }
  .yd-accordion {
    background: none;
    & > div {
      margin-bottom: 10px;
      background: #fff;
    }
    .table {
      width: 100%;
      table-layout: fixed;
      text-align: center;
      border: 1px solid #b6b6b6;
      border-collapse: collapse;
    }
    .table tr th,
    .table tr td {
      border: 1px solid #b6b6b6;
      height: 30px;
    }
    .table2 {
      width: 100%;
      table-layout: fixed;
      text-align: center;
      border-collapse: collapse;
    }
    .table2 a {
      text-decoration: underline;
      color: #3fa9f5;
    }
    .yd-checkbox {
      width: 48%;
      margin-bottom: 20px;
    }
  }
  .comfirmBtn {
    color: #fff;
    text-align: center;
    line-height: 30px;
  }
  .config-wrapper {
    position: absolute;
    top: 40px;
    bottom: 0px;
    height: auto;
    background: #ffffff;
    left: 0;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    .cell-header {
      display: flex;
      border-bottom: 1px solid #d9d9d9;
      padding-left: 10px;
      .cell-value {
        flex: 1;
        text-align: left;
        font-size: 16px;
        line-height: 40px;
        color: #1fb1fb;
      }
    }
    .cell-content {
      display: flex;
      border-bottom: 1px solid #d9d9d9;
      .cell-txt {
        flex: 1;
        text-align: left;
        font-size: 12px;
        line-height: 30px;
        padding-left: 10px;
        border-right: 1px solid #d9d9d9;
        &:last-child {
          border-right: none;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .imglist li {
    height: 50px;
    width: 50px;
    border-radius: 100%;
    overflow: hidden;
    background: #fff;
    display: inline-block;
  }
  .imglist li img {
    display: block;
    width: 100%;
  }
  .select {
    border: none;
    color: white;
  }
}
</style>