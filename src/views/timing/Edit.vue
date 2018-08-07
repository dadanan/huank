<template>
	<div class="timing-wrapper">
		<div class="header">
			<div class="return" @click="returnMethod"></div>
			<span>定时设置</span>
			<span class="edit" @click="saveMethod">保存</span>
		</div>
		<div class="timing-form">
			<div class="form-item">
				<span>标签</span>
				<input v-model="timer.name" />
			</div>
			<div class="form-item time border-none">
				<p>时间</p>
				<yd-datetime type="time" v-model="timer.afterTime" slot="right"></yd-datetime>
			</div>
		</div>
		<div class="timing-but">
			<span>开/关</span>
			<div class="but-group">
				<button class="but" :class="{ active : timer.timerType === 1 }" @click="timer.timerType = 1">定时开</button>
				<button class="but" :class="{ active : timer.timerType === 2 }" @click="timer.timerType = 2">定时关</button>
			</div>
		</div>
		<div class="timing-but">
			<span>策略</span>
			<div class="but-group" style="width: 80%;">
				<button class="but" v-for='item in timelist' :class="{ active : item.type === true }" @click="item.type =!item.type">{{item.name}}</button>
				<!--<button class="but" :class="{ active : timer.timerType === 2 }" @click="timer.timerType = 2">星期二</button>-->
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {
		Loading,
		Toast
	} from 'vue-ydui/dist/lib.rem/dialog';
	import {
		DateTime
	} from 'vue-ydui/dist/lib.rem/datetime';
	import myUrl from 'common/js/api'
	export default {
		data() {
				return {
					timFlag: false,
					datetime: '',
					timer: {
						name: '',
						afterTime: '',
						deviceId: this.$route.query.deviceId,
						timerType: 1,

					},
					timelist:[{
						name: '周一',
						type: false
					}, {
						name: '周二',
						type: false
					}, {
						name: '周三',
						type: false
					}, {
						name: '周四',
						type: false
					}, {
						name: '周五',
						type: false
					}, {
						name: '周六',
						type: false
					}, {
						name: '周日',
						type: false
					}]
				}
			},
			created() {
				if(this.$route.query.id) {
					this.getTimeInfo(this.$route.query.id, this.$route.query.deviceId); //获取定时器详情
				}
			},
			components: {
				'yd-datetime': DateTime,
			},
			computed: {},
			watch: {},
			mounted() {},
			methods: {
				update() {},
				getTimeInfo(id, deviceId) {
					Loading.open('很快加载好了');
					this.$http.get(myUrl.timerDetail + '?timerId=' + id).then(res => {
							if(res.code === 200) {
								this.timer.name = res.data.name;
								this.timer.timerType = res.data.timerType;
								Loading.close();
							}
						})
						.catch(error => {
							Loading.close();
						})
				},
				saveMethod() {
					if(this.timer.name === '') {
						this.$toast('请输入定时器标签', 'bottom');
						return false;
					} else if(this.timer.afterTime === '00:00') {
						this.$toast('请选择定时时间', 'bottom');
						return false;
					}
					Loading.open('很快加载好了');
					let arr = this.timer.afterTime.split(':');
					let time = 0;
					if(arr[0] !== '00') { //取时
						time += parseInt(arr[0] * 60 * 60 * 1000);
					}
					if(arr[1] !== '00') {
						time += parseInt(arr[1] * 60 * 1000);
					}
					let url = myUrl.addTimer;
					if(this.$route.query.id) { //编辑
						this.timer.id = this.$route.query.id;
						url = myUrl.editTimer;
					}

					this.timer.afterTime = parseInt(time);
					this.$http.post(url, this.timer).then(res => {
							if(res.code === 200) {
								Loading.close();
								this.$router.push({
									path: '/timinglist',
									query: {
										deviceId: this.$route.query.deviceId
									}
								})
							}
						})
						.catch(error => {
							Loading.close();
						})
				},
				returnMethod() {
					this.$router.back(-1);
				}
			}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/common/scss/variable.scss";
	@import "src/common/scss/mixins.scss";
	.timing-wrapper {
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
			.edit {
				position: absolute;
				right: 15px;
			}
		}
		.timing-but {
			margin-top: 5px;
			padding: 15px 0px 15px 10px;
			background: #ffffff;
			font-size: 14px;
			position: relative;
			
			.but-group {
				float: right;
				right: 0px;
				margin-right: 20px;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				text-align: right;
				.but {
					padding: 3px 10px;
					border: 1px solid #b3b3b3;
					color: #b3b3b3;
					border-radius: 5px;
					margin-left: 5px;
					margin-bottom: 2px;
					&.active {
						border: 1px solid #20aaf8;
						color: #20aaf8;
					}
				}
			}
		}
		.timing-form {
			background: #ffffff;
			padding-left: 5px;
			padding-right: 5px;
			font-size: 14px;
			.form-item {
				padding: 15px 0px 15px 10px;
				border-bottom: 1px solid #d9d9d9;
				&.time {
					padding: 10px 0px 20px 10px;
					& p {
						margin-bottom: 10px;
					}
				}
				&.border-none {
					border: none;
				}
				& input {
					border: none;
					margin-left: 10px;
					color: #b3b3b3;
				}
			}
		}
	}
</style>