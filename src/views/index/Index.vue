<template>
  <div class="main-wrapper" v-show='pageIsShow' :class="{ active: isOpen === true }" @touchmove.prevent :style="{ 'background-image': 'url(' + img + ')','background-repeat':'no-repeat','background-size':'cover' }">
    <div class="header">
      <span>{{ deviceName }}</span>
      <span class="edit" @click="intoSet"></span>
      <span class="time" v-if="1===2"></span>
    </div>
    <div class="info">
      <img src="../../assets/map.png" style="width:12px;height:auto" />&nbsp;
      <span v-show='formatItemsList[12] && formatItemsList[2].showStatus'>{{location}}&nbsp;</span>
      <span v-show='formatItemsList[13] && formatItemsList[13].showStatus'>{{weather}} {{outerTem}}&nbsp;</span>
      <span v-show='formatItemsList[14] && formatItemsList[14].showStatus'>湿度: {{outerHum}}&nbsp;</span>
      <span v-show='formatItemsList[15] && formatItemsList[15].showStatus'>PM2.5: {{outerPm}}ug/m3&nbsp;</span>
      <span>质量: 优</span>
    </div>
    <div class="but-list">
      <!-- 童锁 -->
      <div class="but-group" v-if='formatItemsList[10] && formatItemsList[10].showStatus'>
        <div class="icon suo" @click="childMethod"></div>
        <div class="text" @click="childMethod">{{formatItemsList[10].showName}}</div>
      </div>
      <div class="but-group" v-if="1===2">
        <div class="icon shop"></div>
        <div class="text">商城</div>
      </div>
      <!-- 开关 -->
      <div class="but-group" v-if='formatItemsList[11] && formatItemsList[11].showStatus'>
        <div class="icon close" :class="{ active:isOpen === true  }" @click="onOffMethod"></div>
        <div class="text" @click="onOffMethod">{{formatItemsList[11].showName}}</div>
      </div>
    </div>
    <div class="center">
      <div class="circle-data" :style="{ height:cHeight+'px' }">
        <div class="circle-inner">
          <p>
            PM2.5
            <span>优</span>
          </p>
          <p v-if='formatItemsList[15] && getAbilityData(formatItemsList[15].abilityId)' :class="{ active:  isOpen === true}">{{getAbilityData(formatItemsList[15].abilityId).currValue}}</p>
          <p>ug/m3</p>
        </div>
      </div>
      <div class="temper">
        <div class="t1" v-if='formatItemsList[8] && formatItemsList[8].showStatus'>
          <p>
            <span>{{getAbilityData(formatItemsList[8].abilityId).currValue}}</span>℃</p>
          <p>
            <!-- 温度 -->
            <span style="font-size:16px">{{formatItemsList[8].showName}}</span>
          </p>
        </div>
        <div class="t2" v-if='formatItemsList[9] && formatItemsList[9].showStatus'>
          <p>
            <span>{{getAbilityData(formatItemsList[9].abilityId).currValue}}</span>%</p>
          <p>
            <!-- 湿度 -->
            <span style="font-size:16px">{{formatItemsList[9].showName}}</span>
          </p>
        </div>
      </div>
      <div class="tip" v-show='formatItemsList[7] && formatItemsList[7].showStatus'>
        <p>滤芯剩余寿命 1204 时</p>
        <p v-if="1===2">设备租赁剩余时间 2 时</p>
      </div>
      <div class="b-data">
        <!-- CO2 -->
        <span v-if='formatItemsList[4] && formatItemsList[4].showStatus'>{{formatItemsList[4].showName}}
          <em>{{getAbilityData(formatItemsList[4].abilityId).currValue}}</em> PPM</span>
        <!-- TVOC -->
        <span v-if='formatItemsList[5] && formatItemsList[5].showStatus && getAbilityData(formatItemsList[5].abilityId)'>{{formatItemsList[5].showName}}
          <em>{{Number(getAbilityData(formatItemsList[5].abilityId).currValue) / 100}}</em> mg/m³</span>
        <span v-if='formatItemsList[6] && formatItemsList[6].showStatus'>{{formatItemsList[6].showName}}
          <!-- 甲醛 -->
          <em>{{Number(getAbilityData(formatItemsList[6].abilityId).currValue) / 100}}</em> mg/m³</span>
      </div>
    </div>
    <div class="but-list fixed">
      <div class="but-group" @click="intiTime" v-if='formatItemsList[0] && formatItemsList[0].showStatus'>
        <div class="icon time"></div>
        <!-- 定时 -->
        <div class="text">{{formatItemsList[0].showName}}</div>
      </div>
      <div class="but-group" @click="switchModel(formatItemsList[1].abilityId)" v-if='formatItemsList[1] && formatItemsList[1].showStatus'>
        <div class="icon model"></div>
        <!-- 模式 -->
        <div class="text">{{formatItemsList[1].showName}}</div>
      </div>
      <div class="but-group" @click="switchSpeed(formatItemsList[2].abilityId)" v-if='formatItemsList[2] && formatItemsList[2].showStatus'>
        <div class="icon shan"></div>
        <!-- 风速 -->
        <div class="text">{{formatItemsList[2].showName}}</div>
      </div>
      <div class="but-group" @click="switchFunction(formatItemsList[3].abilityId)" v-if='formatItemsList[3] && formatItemsList[3].showStatus'>
        <div class="icon menu"></div>
        <!-- 功能 -->
        <div class="text">{{formatItemsList[3].showName}}</div>
      </div>
    </div>
    <yd-popup v-model="modeFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">模式设定</div>
        <div class="list">
          <ul v-if='formatItemsList[1]'>
            <li v-if='item.status !== 2' v-for="(item,index) in getListData(formatItemsList[1].abilityId)" :class="{ active: modeCurrent == index }" @click="nodeClicked(getAbilityData(formatItemsList[1].abilityId),index)" :key='item.optionValue'>
              <span>{{ item.optionDefinedName || item.optionName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <!-- 单/双风机 -->
    <yd-popup v-show='formatItemsList[2] && formatItemsList[2].showStatus' v-model="speedFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">风速设定</div>
        <div class="list">
          <mt-picker ref='picker' :slots="slots" @change="onValuesChange"></mt-picker>
        </div>
      </div>
    </yd-popup>
    <yd-popup v-model="functionFlag" position="bottom" width="90%">
      <div class="content">
        <div class="title">其它功能设定</div>
        <div class="list">
          <ul v-if='formatItemsList[3]'>
            <li v-if='item.status !== 2 &&  getListData(formatItemsList[3].abilityId)' v-for="(item,index) in getListData(formatItemsList[3].abilityId)" :key="item.dirValue" :class="{ active: item.isChecked}" @click="nodeClicked(item,index,3)">
              <span>{{ item.optionDefinedName || item.optionName }}</span>
              <div class="icon"></div>
            </li>
          </ul>
        </div>
      </div>
    </yd-popup>
    <div class="child-suo" v-if="isLock">
      <img src="../../assets/ts.png" />
      <span @click="childMethod(true)">点此解除锁屏</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
import { Popup } from 'vue-ydui/dist/lib.rem/popup'
import { setWechatTitle } from 'utils'
import img1 from '../../assets/bak3.jpg' // 白天阴
import img2 from '../../assets/bak2.jpg' // 夜晚阴
import img3 from '../../assets/bak1.jpg' // 夜晚晴
import img4 from '../../assets/bak4.jpg' // 白天晴
import { Picker } from 'mint-ui'
import Store from '../wenkong/store'
import {
  getModelVo,
  newQueryDetailByDeviceId,
  getLocation,
  getWeather,
  sendFunc
} from '../wenkong/api'

let prevValues = '' //当一次用户选择的picker组件的第二个值，来判断。只有此值变化，才调用指令接口
let currValues = '' // 当前用户所在的左侧滑杆的值

export default {
  data() {
    return {
      pageIsShow: false,
      img: img4,
      windData: {},
      deviceName: '',
      customerName: '',
      cHeight: 200,
      isOpen: true, // 开关
      isLock: false, // 童锁
      modeFlag: false, // 模式设置
      deviceObj: {},
      modeCurrent: undefined,
      speedLeftCurrent: undefined,
      speedRightCurrent: undefined,
      modeData: [],
      speedFlag: false,
      speedData: [],
      functionFlag: false,
      functionCurrent: null,
      functionData: [],
      weather: null,
      currentSpeed: [],
      formatItemsList: [],
      abilitysList: [],
      location: '',
      weather: '',
      outerTem: '',
      outerHum: '', // 湿度
      outerPm: '', // PM2.5
      deviceId: this.$route.query.deviceId,
      wxDeviceId: this.$route.query.wxDeviceId,
      customerId: this.$route.query.customerId,
      setInter: undefined, // 定时id
      singleMachine: true, // 是单风机吗？
      slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'right',
          defaultIndex: 1
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'left',
          defaultIndex: 2
        }
      ],
      thePicker: null, // picker的引用
      twoSeconds: false
    }
  },
  methods: {
    onValuesChange(picker, values) {
      if (!this.twoSeconds) {
        // 2秒后才能执行
        return
      }

      if (this.singleMachine) {
        // 如果单风机，直接发送指令
        sendFunc({
          deviceId: this.deviceId,
          funcId: this.windData.dirValue,
          value:
            this.windData.abilityOptionList.filter(
              item => item.optionDefinedName === values[1]
            )[0] &&
            this.windData.abilityOptionList.filter(
              item => item.optionDefinedName === values[1]
            )[0].optionValue
        }).then(res => {
          Toast({
            mes: '指令发送成功！',
            timeout: 1000,
            icon: 'success'
          })
          console.info(
            '指令发送成功:',
            this.windData.dirValue,
            '-',
            this.windData.abilityOptionList.filter(
              item => item.optionDefinedName === values[1]
            )[0].optionValue
          )
        })

        return
      }
      // 双风机的话，切换对应的档位显示
      // 找到对应的功能项
      const tempData = this.windData.filter(
        item => item.definedName === values[0]
      )[0]

      this.thePicker.setSlotValues(
        1,
        tempData.abilityOptionList.map(
          item => item.optionDefinedName || item.optionName
        )
      )

      // 重新赋值，获取用户当前所在的滑杆（左边那个）
      currValues = values[0]

      // 如果用户没有滑动左侧的滑杆，不调用接口
      if (prevValues === values[1]) {
        return
      }
      prevValues = values[1]
      sendFunc({
        deviceId: this.deviceId,
        funcId: tempData.dirValue,
        value:
          tempData.abilityOptionList.filter(
            item => item.optionDefinedName === values[1]
          )[0] &&
          tempData.abilityOptionList.filter(
            item => item.optionDefinedName === values[1]
          )[0].optionValue
      }).then(res => {
        Toast({
          mes: '指令发送成功！',
          timeout: 1000,
          icon: 'success'
        })
        console.info(
          '指令发送成功:',
          tempData.dirValue,
          '-',
          tempData.abilityOptionList.filter(
            item => item.optionDefinedName === values[1]
          )[0].optionValue
        )
      })
    },
    initWindMachine() {
      // 单双风机分开处理，初始化Picker数据且初始化
      const thePicker = this.thePicker
      if (!this.formatItemsList[2]) {
        return
      }
      const id = this.formatItemsList[2].abilityId
      const abilityOption = this.getListData(id)
      if (!abilityOption) {
        return true
      }

      const firstAbilityOption = abilityOption[0]

      // 找到设备选择的档位值，并且设置默认选择
      let itemSelected = undefined
      // 选项指令小于10的话，就是单风机。
      if (Number(firstAbilityOption.optionValue) < 10) {
        this.singleMachine = true
        // 获取单风机功能项数据
        const windData = this.getAbilityData(id)
        windData.abilityOptionList.forEach((item, index) => {
          if (item.isSelect) {
            itemSelected = index
          }
        })

        const temp = windData.abilityOptionList.map(
          item => item.optionDefinedName || item.optionName
        )
        thePicker.setSlotValues(0, [windData.definedName])
        thePicker.setSlotValues(1, temp)
        this.windData = windData

        thePicker.setSlotValue(1, temp[itemSelected])
        return
      }

      // 如果是双风机
      // 获取风机数据，且重置picker组件
      this.singleMachine = false
      // 拿到数据，组成数组
      const windArray = abilityOption.map(item =>
        this.getAbilityByDirValue(item.dirValue)
      )
      this.windData = windArray

      // 赋值第一个风机的名称位
      if (!currValues) {
        currValues = windArray[0].definedName
      }

      // 如果用户当前是在内风速：即风速数组的第一个元素
      let temp = []
      if (windArray[0].definedName === currValues) {
        windArray[0].abilityOptionList.forEach((item, index) => {
          if (item.isSelect) {
            itemSelected = index
          }
        })

        temp = windArray[0].abilityOptionList.map(
          item => item.optionDefinedName || item.optionName
        )
        thePicker.setSlotValues(0, windArray.map(item => item.definedName))
        thePicker.setSlotValues(
          1,
          windArray[0].abilityOptionList.map(
            item => item.optionDefinedName || item.optionName
          )
        )

        // 设置档位的下标
      } else {
        windArray[1].abilityOptionList.forEach((item, index) => {
          if (item.isSelect) {
            itemSelected = index
          }
        })

        temp = windArray[1].abilityOptionList.map(
          item => item.optionDefinedName || item.optionName
        )
        thePicker.setSlotValues(0, windArray.map(item => item.definedName))
        thePicker.setSlotValues(
          1,
          windArray[1].abilityOptionList.map(
            item => item.optionDefinedName || item.optionName
          )
        )
      }

      thePicker.setSlotValue(1, temp[itemSelected])
      prevValues = temp[itemSelected]
    },
    getAbilityByDirValue(dirValue) {
      // 根据指令值找对应的功能项数据，双风机风速用到
      return this.abilitysList.filter(item => item.dirValue === dirValue)[0]
    },
    getListData(abilityId, which) {
      if (which) {
        // 说明是风速的abilityId，那么特殊情况，特殊处理
        const windOption = this.getListData(abilityId)
        let left = {}
        let right = {}
        if (windOption[0].optionValue === '280') {
          // 如果第一个选项是280，即内风机，那么找到风外风机的ability数据
          left = this.getAbilityByDirValue('280')
          right = this.getAbilityByDirValue(windOption[1].optionValue)
        } else {
          right = this.getAbilityByDirValue('280')
          left = this.getAbilityByDirValue(windOption[1].optionValue)
        }
        if (which === 'left') {
          return left
        }
        return right
      }
      // 根据功能id获取功能项的数据
      let result = this.abilitysList.filter(
        item => item.abilityId === abilityId
      )
      if (result && result[0]) {
        result = result[0].abilityOptionList
      }

      return result
    },
    /**
     * 找到对应的功能项数据
     * @param which left/right 表示内风机/外风机
     */
    getAbilityData(abilityId, which) {
      if (which === 'left') {
        return this.abilitysList.filter(item => item.dirValue === '280')[0]
      }
      if (which === 'right') {
        return this.abilitysList.filter(item => item.dirValue === '281')[0]
      }
      const result = this.abilitysList.filter(
        item => item.abilityId === abilityId
      )[0]
      return result
    },
    changeSpeed(item, index) {
      this.slots[0].values = item.choice
      this.slots[0].defaultIndex = parseInt(item.value) - 1
    },
    intiTime() {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.$router.push({
        path: '/timinglist',
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId
        }
      })
    },
    setModelData(type, id) {
      const data = this.abilitysList.filter(item => item.abilityId === id)[0]
      if (!data) {
        return
      }

      // 根据isSelect的值，对相应选项执行默认选中行为
      data.abilityOptionList &&
        data.abilityOptionList.forEach((item, iIndex) => {
          if (item.isSelect === 0) {
            return
          }

          // “模式”
          if (type === 1) {
            this.modeCurrent = iIndex
            return
          }
          this.speedCurrent = iIndex
        })
    },
    setPopDialogData() {
      // 实时设置下方模式、风速，功能等弹框内的数据
      // 为了解决：弹框打开的情况下，设备状态变化时，弹框内选项数据却没有变更的问题。

      // 更新模式选项
      const updateModel = () => {
        const data = this.abilitysList.filter(
          item => item.abilityId === this.formatItemsList[1].abilityId
        )[0]
        if (!data) {
          return
        }

        // 根据isSelect的值，对相应选项执行默认选中行为
        data.abilityOptionList &&
          data.abilityOptionList.forEach((item, iIndex) => {
            if (item.isSelect === 0) {
              return
            }

            // “模式选项”
            this.modeCurrent = iIndex
          })
      }

      const updateWindSpeed = () => {
        // 找到内风速的功能数据
        // P.S. 这里内外风速区分直接根据指令来做了。
        const dataLeft = this.abilitysList.filter(
          item => item.dirValue === '280'
        )[0]
        if (!dataLeft) {
          return
        }

        // 根据isSelect的值，对相应选项执行默认选中行为
        dataLeft.abilityOptionList &&
          dataLeft.abilityOptionList.forEach((item, iIndex) => {
            if (item.isSelect === 0) {
              return
            }

            // “内风速选项”
            this.speedLeftCurrent = iIndex
          })

        // 外风速的功能数据
        const dataRight = this.abilitysList.filter(
          item => item.dirValue === '281'
        )[0]
        if (!dataRight) {
          return
        }

        // 根据isSelect的值，对相应选项执行默认选中行为
        dataRight.abilityOptionList &&
          dataRight.abilityOptionList.forEach((item, iIndex) => {
            if (item.isSelect === 0) {
              return
            }

            // “外风速选项”
            this.speedRightCurrent = iIndex
          })
      }

      // 功能多选项的初始化
      const updateAbility = () => {
        const data = this.getListData(this.formatItemsList[3].abilityId)
        data.forEach(item => {
          if (item.isSelect == 1) {
            item.isChecked = true
          } else {
            item.isChecked = false
          }
        })
      }

      updateModel()
      updateWindSpeed()
      updateAbility()
    },
    switchModel(id) {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.modeFlag = true
      // this.setModelData(1, id)
    },
    switchSpeed(id) {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      this.speedFlag = true
    },
    switchFunction() {
      if (!this.isOpen) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }
      // 做下功能多选项的初始化
      const data = this.getListData(this.formatItemsList[3].abilityId)
      data.forEach(item => {
        if (item.isSelect == 1) {
          item.isChecked = true
        } else {
          item.isChecked = false
        }
      })
      this.functionFlag = true
    },
    intoSet() {
      if (!this.isOpen) {
        return
      }
      this.$router.push({
        path: '/set',
        query: {
          deviceId: this.deviceId,
          wxDeviceId: this.wxDeviceId,
          customerId: this.customerId
        }
      })
    },
    childMethod(type) {
      if (!this.isOpen && type) {
        this.$toast('当前关机状态，不可操作', 'bottom')
        return false
      }

      // 童锁开关
      const tempArray = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[10].abilityId
      )[0]
      const tempList = tempArray && tempArray.abilityOptionList
      let index = 0
      if (this.isLock) {
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
        this.isLock = !this.isLock
        Toast({
          mes: '指令发送成功！',
          timeout: 1000,
          icon: 'success'
        })
        console.info(
          '指令发送成功:',
          tempArray.dirValue,
          '-',
          tempList[index].dirValue
        )
      })
    },
    onOffMethod() {
      // 开关机

      const tempArray = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[11].abilityId
      )[0]
      const tempList = tempArray && tempArray.abilityOptionList
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
    selectMode(index) {
      this.modeCurrent = index
    },
    selectSpeed(index) {
      this.speedCurrent = index
    },
    nodeClicked(item, index, type) {
      // 如果是功能，index表示将要发送的指令value： 0/1 不选中/选中
      if (type === 3) {
        index = item.isChecked ? 0 : 1
      }

      // 如果当前指令是外风机的，判断是否循环阀是否打开，没有的话。禁止发送指令
      const modelData = this.getListData(this.formatItemsList[3].abilityId)
      const circleSwitch = modelData.filter(item => item.dirValue === '290')[0]

      if (item.dirValue === '281' && circleSwitch.isSelect === 0) {
        Toast({
          mes: '循环阀未打开，禁止操作外风机',
          timeout: 1000,
          icon: 'error'
        })
        return
      }
      this.sendFunc(item, index, type)
    },
    sendFunc(item, index, type) {
      // 模式、风速、功能的指令发送函数
      // Loading.open('发送中...')
      sendFunc({
        deviceId: this.deviceId,
        funcId: item.dirValue,
        value:
          type === 3 ? index : item && item.abilityOptionList[index].dirValue
      })
        .then(res => {
          if (res.code === 200) {
            // Loading.close()

            Toast({
              mes: '发送成功',
              timeout: 1000,
              icon: 'success'
            })
            console.info(
              '指令发送成功:',
              item.dirValue,
              '-',
              type === 3
                ? index
                : item && item.abilityOptionList[index].dirValue
            )
          }
        })
        .catch(error => {
          Loading.close()
        })
    },
    getIndexAbilityData() {
      // 获取H5控制页面功能项数据，带isSelect参数
      getModelVo({ deviceId: this.deviceId, pageNo: 1 }).then(res => {
        if (res.code === 200 && res.data) {
          const data = res.data
          this.pageName = data.pageName
          data.abilitysList.forEach(item => {
            item['currValue'] = ''
            item &&
              item.abilityOptionList &&
              item.abilityOptionList.forEach(iItem => {
                iItem.isChecked = false
              })
          })
          this.abilitysList = data.abilitysList

          // 将功能集里的内外风机的数据加到版式集合中。为了后面持续刷新两个风机的数据
          const windBoxId = data.formatItemsList[2].abilityId
          let wind = data.abilitysList.filter(
            item => item.abilityId === windBoxId
          )[0]

          let appendData = []
          if (wind && wind.abilityOptionList) {
            let windOption = wind.abilityOptionList
            // 如果数据判断存在
            if (Number(windOption[0].optionValue) > 10) {
              // 如果是双风机
              appendData = windOption.map(item => {
                return {
                  abilityId: this.getAbilityByDirValue(item.optionValue)
                    .abilityId
                }
              })
            }
          }
          this.formatItemsList = data.formatItemsList.concat(appendData)

          // 定时请求接口数据，更新页面数据
          this.setInter = setInterval(() => {
            this.getIndexFormatData()
          }, 1000)
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
        abilityIds: this.formatItemsList
          .filter(item => item.abilityId)
          .map(item => item.abilityId)
      }).then(res => {
        const data = res.data
        // 将res.data中的isSelect和dirValue赋值过去
        this.abilitysList.forEach((item, index) => {
          // 如果有值，说明是温度这样的功能项，讲数值拿过来
          // 开机状态才更新数据
          if (this.isOpen && data[index] && data[index].currValue) {
            // 找到对应的功能项对象
            const temp = this.abilitysList.filter(
              itemA => itemA.abilityId === data[index].id
            )[0]

            try {
              temp['currValue'] = data[index].currValue
            } catch (e) {}
          }
          if (
            !item ||
            !item.abilityOptionList ||
            item.abilityOptionList.length === 0
          ) {
            return
          }

          item.abilityType !== 1 &&
            item &&
            item.abilityOptionList.forEach((option, oIndex) => {
              // 如果此时关机 且 不是开关机的数据，则不更新
              if (
                !this.isOpen &&
                item.abilityId !== this.formatItemsList[11].abilityId
              ) {
                return
              }
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
        if (this.isOpen) {
          // 开机状态才刷新数据
          this.setPopDialogData()
          this.initWindMachine()
        }
      })
    },
    getLocation() {
      getLocation(this.deviceId).then(res => {
        const data = res.data
        // 直辖市
        const area = [
          '北京市',
          '天津市',
          '上海市',
          '重庆市',
          '北京',
          '天津',
          '上海',
          '重庆'
        ]
        if (area.includes(data.city)) {
          data.location = data.city
        }
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
    switchHandler() {
      // 开关机初始化
      let tempArray = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[11].abilityId
      )

      if (tempArray && tempArray[0]) {
        tempArray = tempArray[0].abilityOptionList
      }

      // 找到关机的对象
      const tempObj = tempArray[0].dirValue == 0 ? tempArray[0] : tempArray[1]
      if (tempObj.isSelect === 1) {
        // 说明是关机
        this.isOpen = false
      } else {
        this.isOpen = true
      }

      // 童锁初始化
      let tempArray2 = this.abilitysList.filter(
        item => item.abilityId === this.formatItemsList[10].abilityId
      )
      if (tempArray2 && tempArray2[0]) {
        tempArray2 = tempArray2[0].abilityOptionList
      }

      const tempObj2 =
        tempArray2[0].dirValue == 0 ? tempArray2[0] : tempArray2[1]
      if (tempObj2.isSelect === 1) {
        this.isLock = false
      } else {
        this.isLock = true
      }
    }
  },
  created() {
    setTimeout(() => {
      this.pageIsShow = true
    }, 1000)
    setTimeout(() => {
      this.twoSeconds = true
    }, 2000)
    this.cHeight = window.innerWidth * 0.45
    if (window.innerWidth <= 340) {
      this.cHeight = window.innerWidth * 0.45
    }
    this.deviceName = Store.fetch('deviceName')
    this.customerName = Store.fetch('customerName')
    setWechatTitle(this.customerName, '')

    this.getIndexAbilityData()
    this.getLocation()
    this.getWeather()
  },
  mounted() {
    this.thePicker = this.$refs.picker
  },
  watch: {
    isOpen: function(val) {
      if (val) {
        this.img = img4
      } else {
        this.img = ''
      }
    }
  },
  components: {
    'yd-popup': Popup,
    'mt-picker': Picker
  },
  destroyed() {
    clearInterval(this.setInter)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/common/scss/variable.scss';
@import 'src/common/scss/mixins.scss';
.main-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
  top: 0;
  bottom: 0;
  background-color: #999999;
  color: #ffffff;
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: linear;
  .child-suo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    & img {
      width: 20%;
      margin-top: 40%;
    }
    & span {
      position: absolute;
      bottom: 100px;
      left: 50%;
      margin-left: -42px;
      font-size: 14px;
      border: 1px solid #fff;
      border-radius: 20px;
      line-height: 32px;
      width: 110px;
    }
  }
  &.active {
    //background-color:-webkit-gradient(linear, 0 0, 0 top, from(#2689ed), to(rgba(30, 79, 251, 0.8)));
    //background-color: #21a6f7;
  }
  .info {
    margin: 0 auto tvw(34) auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    span {
      color: #fff;
      font-size: tvw(83);
    }
  }
  .header {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    position: relative;
    .time {
      position: absolute;
      left: 15px;
      top: 3px;
      color: #ffffff;
    }
    .edit {
      position: absolute;
      z-index: 999;
      right: 15px;
      width: 20px;
      height: 20px;
      top: 10px;
      background: url('../../assets/set.png') no-repeat center center;
      background-size: 20px 20px;
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
    }
    .spec {
      padding-left: 10px;
      padding-right: 10px;
      & ul li {
        &.active {
          color: #000;
          background: url('../../assets/left.png') no-repeat center right 60%;
          background-size: 20px 15px;
        }
      }
    }
    .wind-speed-list {
      display: flex;
      justify-content: space-between;
      > div {
        > p {
          margin-top: 10px;
        }
        width: 45%;
      }
    }
  }
  .center {
    margin-top: 10px;
    .tip {
      text-align: center;
      margin-top: 10px;
      font-size: 12px;
      line-height: 20px;
    }
    .b-data {
      margin-top: 10px;
      font-size: 12px;
      text-align: center;
      & span {
        margin-right: 10px;
        font-size: 13px;
        & em {
          font-size: 18px;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }
    .temper {
      width: 55%;
      margin: 0 auto;
      margin-top: 10px;
      position: relative;
      overflow: hidden;
      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 30px;
        background: #ffffff;
        left: 50%;
        top: 10px;
      }
      & div {
        text-align: center;
        font-size: 14px;
        line-height: 24px;
        & span {
          font-size: 16px;
        }
      }
      .t1 {
        float: left;
      }
      .t2 {
        float: right;
      }
      em {
        font-weight: 500;
      }
      span {
        word-break: keep-all;
      }
    }
    .circle-data {
      width: 45%;
      border: 1px solid #ffffff;
      border-radius: 100%;
      @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
        width: 45%;
      }

      margin: 0 auto;
      .circle-inner {
        width: 95%;
        height: 100%;
        border: 1px solid #ffffff;
        border-radius: 100%;
        margin: 0 auto;
        text-align: center;
        & p:nth-child(1) {
          margin-top: 30px;
          font-size: 24px;
        }
        & p:nth-child(2) {
          font-size: 450%;
          font-weight: 600;
          color: #d86e5d;
          letter-spacing: 5px;
          transition-property: color;
          transition-duration: 0.3s;
          transition-timing-function: linear;
          @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
            font-size: 300%;
          }
          &.active {
            color: #5ddb5d;
          }
        }
      }
    }
  }
  .but-list {
    margin-top: 10px;
    display: flex;
    text-align: center;
    font-size: 14px;
    @media only screen and (min-device-width: 320px) and (max-device-width: 340px) {
      margin-top: 10px;
    }
    &.fixed {
      position: fixed;
      bottom: 10px;
      width: 100%;
    }
    .but-group {
      flex: 1;
      & .icon {
        width: 35px;
        height: 35px;
        border: 1px solid #ffffff;
        border-radius: 100%;
        margin: 0 auto;
        margin-bottom: 5px;
        &.suo {
          background: url('../../assets/suo.png') no-repeat center center;
          background-size: 15px 20px;
        }
        &.shop {
          background: url('../../assets/cart.png') no-repeat center left 7px;
          background-size: 23px 18px;
        }
        &.close {
          background: url('../../assets/close.png') no-repeat center center;
          background-size: 18px 21px;
          //background-color:#20a8f8;
          border: 1px solid #ffffff;
          &.active {
            border: 1px solid #ffffff;
          }
        }
        &.time {
          background: url('../../assets/zhong.png') no-repeat center center;
          background-size: 21px 20px;
        }
        &.model {
          background: url('../../assets/modle.png') no-repeat center center;
          background-size: 17px 15px;
        }
        &.shan {
          background: url('../../assets/shan.png') no-repeat center top 6px;
          background-size: 22px 20px;
        }
        &.menu {
          background: url('../../assets/menu.png') no-repeat center center;
          background-size: 18px 16px;
        }
      }
    }
  }
}
</style>