<template>
	<div class="list-wrapper">
		<yd-accordion style="position: relative;padding-bottom: 50px;" v-if="devGroupList.length">
			<yd-accordion-item open="open" v-for="(item,index) in devGroupList" :key="index" v-press="press">
				<div slot="title">
					<img :src="item.icon" />
					<span>{{item.groupName}}</span>
				</div>
				<div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 90px;" v-show="groupFlag && item.groupName !== '默认组'" @click="OpenGroup(item)">编辑</div>
				<div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 60px;" v-show="groupFlag && item.groupName !== '默认组'" @click="deleteGroup(item.groupId)">删除</div>
				<div slot="txt" style="color:#20aaf8;margin-left:5px; position: absolute; right: 30px;" v-show="groupFlag && item.groupName !== '默认组'" @click="groupFlag = false">取消</div>
				<div style="padding:15px">
					<div class="list-item" v-swipeleft="swipeleft" v-swiperight="swiperight" @click="intoIndex(child.deviceId,child.deviceName,child.icon,child.deviceTypeName)" v-for="(child,cindex) in item.deviceItemPos" :key="cindex">
						<div class="item-left">
							<div class="icon" :class="{ active : containIds(child.deviceId) }" v-if="loopValue === true" @click.stop="selectDev(child.deviceId)"></div>
							<div class="img">
								<div class="p-img">
									<img :src="child.icon">
									<span v-if="child.onlineStatus === 1"><em>在线</em></span>
									<span class="active" v-else><em>离线</em></span>
								</div>
								<div class="img-text">
									<p><span>{{ child.deviceName }}</span><i class="addr"></i><span>{{child.location.split(',')[1]}}</span></p>
									<p>ID:{{ child.deviceId }}</p>
									<p>型号：{{ child.deviceTypeName }}</p>
								</div>
							</div>
						</div>
						<div class="item-right">
							<span class="group" v-if="loopValue === true" @click.stop="OpenDev(child,item.groupName,1)">分组</span>
							<span class="edit" v-if="loopValue === true" @click.stop="OpenDev(child,2)">编辑</span>
							<span class="delete" v-if="loopValue === true" @click.stop="deleteDev(child)" style="color: #a0a0a0;">删除</span>
							<p>PM2.5 </p>
							<p>{{child.pm}}ug/m³</p>
						</div>
					</div>
					<div v-if="item.deviceItemPos.length === 0">暂无产品</div>
				</div>
			</yd-accordion-item>
		</yd-accordion>
		<div v-else style="padding:10px 10px;">暂无产品</div>
		<div class="fixed-bottom">
			<div class="group">
				<div class="active" @click="qRcode" v-if="!loopValue">扫码添加</div>
				<div class="active" v-else @click="selctButtonMethod(1,'cancel')">取消分组</div>
				<div class="" @click="selctButtonMethod(0,'create')">新建分组</div>
			</div>
		</div>
		<div class="wx-dialog dialog" v-if="wxValue">
			<div class="confirm">
				<div class="confim-top">
					<p>设备联网提示</p>
					<ul>
						<li>
							<p>1.请打开设备电源</p>
						</li>
						<li>
							<p>2.长按设备上的配置按钮3秒以上</p>
						</li>
						<li>
							<p>3.听到‘滴’声后点击下一步</p>
						</li>
					</ul>
				</div>
				<div class="confim-bottom">
					<div class="but" @click="wxValue = false">取消</div>
					<div class="but">下一步</div>
				</div>
			</div>
		</div>
		<div class="create-dialog dialog" v-if="createValue">
			<div class="confirm">
				<div class="confim-top">
					<textarea class="name" placeholder="在此输入新建分组的名称" v-model="groupName"></textarea>
				</div>
				<div class="confim-bottom">
					<div class="but" @click="createValue = false">取消</div>
					<div class="but create" @click="addGroup">确定</div>
				</div>
			</div>
		</div>
		<div class="create-dialog dialog" v-if="editDevFlag">
			<div class="confirm">
				<div class="confim-top">
					<textarea class="name" style="min-height:50px;" placeholder="输入新设备的名称" v-model="devInfo.deviceName"></textarea>
				</div>
				<div class="confim-bottom">
					<div class="but" @click="editDevFlag = false">取消</div>
					<div class="but create" @click="editDev">确定</div>
				</div>
			</div>
		</div>
		<div class="create-dialog dialog" v-if="groupNameFlag">
			<div class="confirm">
				<div class="confim-top">
					<textarea class="name" style="min-height:50px;" placeholder="输入组的名称" v-model="groupInfo.groupName"></textarea>
				</div>
				<div class="confim-bottom">
					<div class="but" @click="groupNameFlag = false">取消</div>
					<div class="but create" @click="editGroupName">确定</div>
				</div>
			</div>
		</div>
		<div class="create-dialog dialog" v-if="groupDialog">
			<div class="confirm" style="padding: 0;">
				<div class="confim-top" style="text-align: left; color: #fff; padding: 0 10px 10px; ">
					<h4 class="title">{{selname}}</h4>
					<p style="padding-top:10px ;">请选择组：</p>
					<div>
						<yd-radio-group v-model="selectId" color="#00ff00">
							<yd-radio :val="item.groupId" v-if="currentGroupName != item.groupName" style="margin-top:10px;width:100%;color: #fff " v-for="(item,index) in devGroupList" :key="index">{{ item.groupName }}</yd-radio>
						</yd-radio-group>
					</div>
				</div>
				<div class="confim-bottom">
					<div class="but" @click="cancelGroup">取消</div>
					<div class="but create" @click="editGroup">确定</div>
				</div>
			</div>
		</div>
		<!--删除设备-->
		<div class="create-dialog dialog" v-if="delDevFlag">
			<div class="confirm">
				<div class="confim-top">
					<p style="padding:10px;">您确认要解除该设备的绑定吗？</p>
				</div>
				<div class="confim-bottom">
					<div class="but" @click="delDevFlag = false">取消</div>
					<div class="but create" @click="confirmdeleteDev">确定</div>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script type="text/ecmascript-6">
	import {
		Loading,
		Toast
	} from 'vue-ydui/dist/lib.rem/dialog'
import {
		Accordion,
		AccordionItem
	} from 'vue-ydui/dist/lib.rem/accordion'
import myUrl from 'common/js/api'
	import {
		getQueryString
	} from 'utils'
	import {
		scanQRCode
	} from 'utils/wx'
	import {
		Radio,
		RadioGroup
	} from 'vue-ydui/dist/lib.rem/radio'

export default {
	  data () {
	return {
	  currentGroupName: '',
	  selectId: '', // 选择需要的分组id
	  groupDialog: false,
	  groupNameFlag: false,
	  groupFlag: false,
	  value: '',
	  loop: null, // 长按
	  loopValue: false,
	  select: 0,
	  wxValue: false,
	  createValue: false,
	  editDevFlag: false,
	  groupName: '',
	  devInfo: {},
	  groupInfo: {},
	  devName: '',
	  devGroupList: [],
	  devIds: [], // 选中设备id列表
	  delDevFlag: false,
	  deviceId: '',
	  selname: ''
	}
	},
	  components: {
	    'yd-accordion': Accordion,
	    'yd-accordion-item': AccordionItem,
	    'yd-radio-group': RadioGroup,
	    'yd-radio': Radio
	},
	  created () {
	    if (JSON.parse(sessionStorage.getItem('obj'))) { // 分享人进来
	      console.log('从分享进来')
	      this.shareBind(JSON.parse(sessionStorage.getItem('obj')))
	    } else {
	      console.log('未从分享进来')
	      this.getDeviceList()
	    }
	},
	  computed: {},
	  watch: {},
	  mounted () {

	},
	  methods: {
	    cancelGroup () {
	      this.groupDialog = false
	      this.selectId = ''
	    },
	    qRcode () {
	      scanQRCode()
	    },
	    swipeleft (s, e) { // 左滑动
	      this.loopValue = true
	    },
	    swiperight (s, e) { // 右滑动
	      this.loopValue = false
	    },
	    press (s, e) {
	      this.groupFlag = true
	    },
	    returnMethod () {
	      this.$router.back(-1)
	    },
	    editGroupName () {
	      Loading.open('很快加载好了')
	      this.$http.get(myUrl.updateGroupName + '?groupId=' + this.groupInfo.groupId + '&groupName=' + this.groupInfo.groupName).then(res => {
	        if (res.code === 200) {
	          Loading.close()
	          this.groupNameFlag = false
	          this.getDeviceList()
	        }
	})
						.catch(error => {
	  Loading.close()
	  this.$toast(error.msg, 'bottom')
	})
	},
	    deleteGroup (id) {
	      this.$http.get(myUrl.deleteGroup + '?groupId=' + id).then(res => {
	        if (res.code === 200) {
	          Toast({
	            mes: '删除成功',
	            timeout: 1500,
	            icon: 'success'
	})
	          Loading.close()
	          this.getDeviceList()
	        }
	})
						.catch(error => {
	  Loading.close()
	})
	},
	    editGroup () {
      if (this.selectId === '') {
        this.$toast('请选择组', 'bottom')
      } else {
        let data = {}
	        data.deviceIds = []
	        data.deviceIds.push(this.devInfo.deviceId)
	        data.groupId = this.selectId
	        this.$http.post(myUrl.updateDeviceGroup, data).then(res => {
          if (res.code === 200) {
            this.groupDialog = false
	            this.selectId = ''
	            Toast({
              mes: '分组成功',
              timeout: 1500,
              icon: 'success'
            })
	            Loading.close()
	            this.getDeviceList()
	          }
        })
						.catch(error => {
  Loading.close()
	})
      }
    },
	    deleteDev (obj) {
	      this.delDevFlag = true
	      this.deviceId = obj.deviceId
	    },
	    confirmdeleteDev () {
	      Loading.open('很快加载好了')
	      this.$http.get(myUrl.deleteDevice + '?deviceId=' + this.deviceId).then(res => {
	        if (res.code === 200) {
	          Toast({
	            mes: '删除成功',
	            timeout: 1500,
	            icon: 'success'
	})
	          Loading.close()
	          this.getDeviceList()
	        }
	})
						.catch(error => {
	  Loading.close()
	})
	},
	    gtouchstart () {
	      let that = this
	      that.loop = setTimeout(function () {
	        that.loopValue = true
	}, 3000)
	      return false
	    },
	    gtouchmove () {
	      clearTimeout(this.loop) // 清除定时器
	      this.loopValue = false
	    },
	    gtouchend () {
	      clearTimeout(this.loop) // 清除定时器
	      if (this.loopValue) {

	}
	      return false
	    },
	    selctButtonMethod (nums, type) {
	      this.select = nums
	      if (type === 'cancel') {
	        this.loopValue = false
	        this.groupFlag = false
	        this.select = 0
	} else if (type === 'wx') {
	  this.wxValue = true
	} else if (type === 'create') {
	  this.createValue = true
	}
	},
	    getDeviceList () {
	      Loading.open('很快加载好了')
	      this.$http.get(myUrl.obtainMyDevice).then(res => {
	        if (res.code === 200) {
	          Loading.close()
	          this.loopValue = false
	          this.groupFlag = false
	          if (res.data.groupDataList && res.data.groupDataList.length) {
	            this.devGroupList = res.data.groupDataList
	}
	}
	})
						.catch(error => {
	  Loading.close()
	})
	},
	    addGroup () {
	      if (this.groupName === null || this.groupName === '') {
	        this.$toast('请输入设备组名称', 'bottom')
	        return
      }

	      Loading.open('很快加载好了')
	      let data = {
	        groupName: this.groupName
	}
	      if (this.devIds.length) { // 选中了设备
	        data.deviceIds = this.devIds
	      }
	      this.$http.post(myUrl.createGroup, data).then(res => {
	        if (res.code === 200) {
	          Loading.close()
	          this.getDeviceList()
	          this.createValue = false
	        }
	})
						.catch(error => {
	  Loading.close()
	})
	},
	    OpenGroup (obj) {
	      this.groupNameFlag = true
	      this.groupInfo = Object.assign({}, obj)
	    },
	    OpenDev (obj, name, type) {
	      if (name) {
	        this.currentGroupName = name
	      }
	      this.selname = obj.deviceName
	      if (type === 1) {
	        this.groupDialog = true
	} else {
	        this.editDevFlag = true
	}
	      this.devInfo = Object.assign({}, obj)
	    },
	    editDev () {
	      Loading.open('很快加载好了')
	      this.$http.get(myUrl.editDevice + '?deviceId=' + this.devInfo.deviceId + '&deviceName=' + this.devInfo.deviceName).then(res => {
	        if (res.code === 200) {
	          Loading.close()
	          this.editDevFlag = false
	          this.getDeviceList()
	        }
	})
						.catch(error => {
	  Loading.close()
	  this.$toast(error.msg, 'bottom')
	})
	},
	    intoIndex (id, name, icon, model) {
	      sessionStorage.setItem('name', name)
	      sessionStorage.setItem('icon', icon)
	      sessionStorage.setItem('model', model)
	      this.$router.push({
	        path: '/index',
	        query: {
	          deviceId: id
	}
	})
	},
	    selectDev (id) {
	      let index = this.devIds.indexOf(id)
	      if (index > -1) { // 找到了
	        this.devIds.splice(index, 1)
	} else {
	        this.devIds.push(id)
	}
	},
	    containIds (id) {
	      return this.devIds.includes(id)
	    },
	    shareBind (obj) { // 分享绑定
	      this.$http.get(myUrl.share + '?masterOpenId=' + obj.masterOpenId + '&deviceId=' + obj.deviceId + '&token=' + obj.token).then(res => {
	        if (res.code === 200) {
	          if (res.data) { // 成功
	            Toast({
	              mes: '绑定成功',
	              timeout: 1500,
	              icon: 'success'
	})
	          } else {
	            Toast({
	              mes: '链接已过期',
	              timeout: 1500
	})
	          }
	          this.getDeviceList() // 获取设备列表
	        }
	})
						.catch(error => {
	  this.$toast(error.msg, 'bottom')
	})
	}
	}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/common/scss/variable.scss";
	@import "src/common/scss/mixins.scss";
	.list-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #ffffff;
		.none-device {
			padding: 10px 10px;
		}
		.flex {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
		}.flex-pack-justify {
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
			background-color: rgba(0, 0, 0, .5);
			.confirm {
				width: 80%;
				background-color: #ffffff;
				border-radius: 5px;
				font-size: 15px;
				overflow: hidden;
				animation: zoom-in .15s ease forwards;
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
		.fixed-bottom {
			position: fixed;
			bottom: 0px;
			height: 50px;
			line-height: 50px;
			width: 100%;
			font-size: 14px;
			.group {
				position: relative;
				width: 100%;
				font-size: 14px;
				& div {
					width: 50%;
					text-align: center;
					float: left;
					border-top: 1px solid #2689ee;
					background: #f7f7fa;
					color: #2689ee;
					&.active {
						background: #2689ee;
						color: #ffffff;
					}
				}
			}
		}
		.list-item {
			position: relative;
			display: flex;
			border-bottom: 1px solid #d9d9d9;
			padding-bottom: 5px;
			margin-bottom: 5px;
			.item-left {
				display: flex;
				align-items: center;
				.icon {
					width: 15px;
					height: 15px;
					background: url('../../assets/ju.png') no-repeat center center;
					background-size: 15px 15px;
					margin-right: 5px;
					&.active {
						background: url('../../assets/ju_select.png') no-repeat center center;
						background-size: 15px 15px;
					}
				}
				.img {
					width: 60px;
					height: 60px;
					border: 1px solid #d9d9d9;
					border-radius: 100%;
					position: relative;
					//overflow: hidden;
					.p-img {
						position: relative;
						width: 60px;
						height: 60px;
						overflow: hidden;
						border-radius: 100%;
						& span {
							position: absolute;
							width: 100%;
							height: 70px;
							bottom: 0px;
							text-align: center;
							color: #ffffff;
							background: url('../../assets/bak.png') no-repeat center center;
							background-size: 60px 60px;
							line-height: 30px;
							font-size: 10px;
							&.active {
								background: url('../../assets/bak2.png') no-repeat center center;
								background-size: 60px 19px;
								bottom: 0px;
								height: 19px;
							}
							& em {
								position: absolute;
								bottom: -6px;
								text-align: center;
								width: 100%;
								left: 0;
							}
						}
						& img {
							width: 100%;
							height: auto;
						}
					}
					.img-text {
						position: absolute;
						left: 75px;
						top: 50%;
						transform: translateY(-50%);
						width: 180px;
						color: #666666;
						line-height: 16px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						& p:nth-child(1) {
							font-size: 14px;
							margin-bottom: 5px;
							color: #111111;
						}
						& p:nth-child(2) {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.addr {
							/*background: url('../../assets/addr2.png') no-repeat center center;*/
							height: 13px;
							width: 13px;
							display: inline-block;
							background: url('../../assets/map1.png') no-repeat center center;
							background-size: contain;
							margin: 0 8px;
						}
					}
				}
			}
			.item-right {
				flex: 1;
				line-height: 16px;
				align-items: center;
				justify-content: flex-end;
				text-align: right;
				padding-top: 30px;
				position: relative;
				& span {
					text-decoration: underline;
				}
				& .group {
					position: absolute;
					top: 10px;
					font-size: 12px;
					color: #20aaf8;
					right: 60px;
				}
				& .edit {
					position: absolute;
					top: 10px;
					font-size: 12px;
					color: #20aaf8;
					right: 30px;
				}
				& .delete {
					position: absolute;
					top: 10px;
					font-size: 12px;
					color: #aaa;
					right: 0px;
				}
			}
			&:last-child {
				border-bottom: none;
				margin-bottom: 0px;
			}
		}
	}
	
	@keyframes zoom-in {
		0% {
			opacity: 0;
			-webkit-transform: scale3d(.3, .3, .3);
			transform: scale3d(.3, .3, .3)
		}
		50% {
			opacity: 1
		}
	}
	
	textarea::-webkit-input-placeholder {
		color: #93c4f7 !important;
	}
	
	input {
		-webkit-user-select: auto;
		/*webkit浏览器*/
	}
</style>