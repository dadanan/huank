<template>
  <div class="timing-wrapper">
    <div class="header">
      <div class="return" @click="returnMethod"></div>
      <span>定时预约</span>
      <span class="edit" @click="save" v-if="isEdit">取消</span>
      <span class="edit" @click="edit" v-else>编辑</span>
    </div>
    <div class="timing-list" v-if="timeList.length">
      <div class="list-box" v-for="(item,index) in timeList" :key="index">
        <div class="box-left" :ref="'boxref'+(index)"> 
          <div class="del" style="float:left" @click="delTimer(item.id)">删除</div>
          <div class="c-text">
            <p v-if="item.remainTime !== 0">{{ MillisecondToDate(item.remainTime) }}后关闭</p>
            <p v-else>已过期</p>
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="box-right" v-if="!isEdit">
          <div class="switch-box">
            <span>定时{{ item.timerType === 1 ? '开': '关' }}</span>
            <yd-switch v-model="item.switch1" @click.native="switchMethod(item.id,item.status)"></yd-switch>
          </div>
        </div>
        <div class="box-right" v-else>
          <span @click="intoTimeInfo(item.id)">详情</span>
        </div>
      </div>
    </div>
    <div class="time-none" v-else>暂无数据</div>
    <div class="add-timing" @click="intoTimeDet">添加定时</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Switch } from 'vue-ydui/dist/lib.rem/switch';
import { addClass,removeClass } from 'utils/dom';
import { Loading,Toast } from 'vue-ydui/dist/lib.rem/dialog';
import myUrl  from 'common/js/api'
import Vue from 'vue'

export default {
  data () {
    return {
     isEdit:false,
     timeList:[],
     value:'',
    }
  },
  components: {
    'yd-switch':Switch,
  },
  created(){
  },
  computed: {
  },
  watch: {
    timeList:{
      handler: function(val){
        //console.log(val);
      },
      deep:true
    }
  },
  mounted(){
    this.getTimeList();
  },
  methods:{
    delTimer(id){
      Loading.open('很快加载好了');
      this.$http.get(myUrl.deleteTimer + '?timerId='+id).then(res => {
        if(res.code === 200){
          Loading.close(); 
          Toast({
              mes: '删除成功',
              timeout: 1500,
              icon: 'success'
          });
          this.getTimeList();
          this.save();
        }
      })
      .catch(error =>{
        Loading.close();  
      })
    },
    returnMethod(){
      this.$router.back(-1);
    },
    edit(){
      this.isEdit = !this.isEdit;
      this.value = 'active';
      console.log(this.$refs.boxref1);
      $('.box-left').addClass('active')
      //addClass(this.$refs.boxref1,'active');
    },
    save(){
      this.isEdit = !this.isEdit;
      this.value = '';
      $('.box-left').removeClass('active');
    },
    getTimeList(){
      Loading.open('很快加载好了');
      this.$http.get(myUrl.queryTimerList + '?deviceIdStr='+this.$route.query.deviceId).then(res => {
        if(res.code === 200){
          Loading.close(); 
          this.timeList = res.data;
          this.timeList.forEach(v => {
            if(v.status === 1){
              Vue.set(v,'switch1',true)
            }else{
              Vue.set(v,'switch1',false)
            }
          })
        }
      })
      .catch(error =>{
        Loading.close();  
      })
    },
     MillisecondToDate(msd) {  
        var time = parseFloat(msd) /1000;  
        if (null!= time &&""!= time) {  
            if (time >60&& time <60*60) {  
                time = parseInt(time /60.0) +"分钟";
            }else if (time >=60*60&& time <60*60*24) {  
                time = parseInt(time /3600.0) +"小时"+ parseInt((parseFloat(time /3600.0) -  
                parseInt(time /3600.0)) *60) +"分钟"
            }else {  
                time = parseInt(time) +"秒";  
            }  
        }else{  
            time = "0 时 0 分0 秒";  
        }  
        return time;  
      
    },  
    switchMethod(id,status){
      if(status === 1){
        status = 2;
      }else{
        status = 1;
      }
      Loading.open('很快加载好了');
      this.$http.get(myUrl.cancelTimer + '?timerId='+id+'&status='+status).then(res => {
        if(res.code === 200){
          this.getTimeList();
          Loading.close(); 
        }
      })
      .catch(error =>{
        Loading.close();  
      })
    },
    intoTimeInfo(id){
      this.$router.push({
        path:'/timingedet',
        query:{
          id:id,
          deviceId:this.$route.query.deviceId
        }
      })
    },
    intoTimeDet(){
      this.$router.push({
        path:'/timingedet',
        query:{
          deviceId:this.$route.query.deviceId
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/common/scss/variable.scss";
  @import "src/common/scss/mixins.scss";
  .timing-wrapper{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    .header{
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
      position: relative;
      .return{
        position: absolute;
        left:0px;
        background: url('../../assets/arr-left.png') no-repeat center center;
        background-size: 8px 16px;
        width: 40px;
        height: 40px;
        display: block;
        top:0px;
      }
      .edit{
        position: absolute;
        right:15px;
      }
    }
    .time-none{
      position: fixed;
      width: 100%;
      text-align: center;
      bottom: 100px;
    }
    .add-timing{
      position: fixed;
      bottom: 15px;
      width: 80%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #ffffff;
      background: #20aaf8;
      left: 50%;
      margin-left: -40%;
      border-radius: 5px;
      font-size: 16px;
    }
    .timing-list{
      .list-box{
        height: 50px;
        background: #ffffff;
        padding-right: 15px;
        display: flex;
        font-size: 14px;
        position: relative;
        margin-bottom: 10px;
        .c-text{
          position: absolute;
          width:200px;
          left:80px;
          top:50%;
          transform: translateY(-50%);
        }
        & div{
          flex: 1;
        }
        .box-left{
          position: relative;
          line-height: 18px;
          left:-65px;
          transition-duration: 0.3s;
          transition-timing-function: ease;
          &.active{
            left:0px;
            & .c-text{
              left:65px;
            }
          }
          .del{
            width: 50px;
            height: 50px;
            background: #20aaf8;
            color: #ffffff;
            text-align: center;
            line-height: 50px;
            position: relative;
            display: block;
          }
          & p:nth-child(2){
            font-size: 12px;
            color:#b3b3b3;
          }
        }
        .box-right{
            text-align: right;
            line-height: 50px;
            position: relative;
            .switch-box{
              float: right;
              position: absolute;
              right: 0;
              top:50%;
              transform: translateY(-50%);
              & span{
                position: absolute;
                left: -50px;
                color:#b3b3b3;
                top:-10px;
              }
            }
          }
      }
    }
    
  }
  
  
</style>

