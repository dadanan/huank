<template>
  <div class="set-wrapper">
    
  <draggable v-model="myArray" :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
    <transition-group>
        <div class="box" v-for="element in tags" :key="element.id">
            {{element.name}}
        </div>
    </transition-group>
  </draggable>

  <draggable v-model="myArray2" :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
    <transition-group>
        <div class="box" v-for="element in tags2" :key="element.id">
            {{element.name}}
        </div>
    </transition-group>
  </draggable>
        

  </div>
</template>

<script type="text/ecmascript-6">
import { Loading, Toast} from 'vue-ydui/dist/lib.rem/dialog'
import myUrl from 'common/js/api'
import Vue from 'vue'
import draggable from 'vuedraggable'

export default {
  data () {
    return {
      myArray: [],
      myArray2: [],
      tags: [
        {
          id: 0,
          name: '测试1'
        },
        {
          id: 1,
          name: '测试2'
        }
      ],
      tags2: [
        {
          id: 3,
          name: '测试3'
        },
        {
          id: 4,
          name: '测试4'
        }
      ]
    }
  },
  created () {

  },
  components: {
    draggable
  },
  computed: {
  },
  watch: {
  },
  mounted () {

  },
  methods: {
    getdata (evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd (evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.tags)
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/common/scss/variable.scss";
  @import "src/common/scss/mixins.scss";

  .set-wrapper{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    & .box{
      color: #ffffff;
      line-height: 40px;
       height: 40px;
      background: blue;
      margin-bottom: 10px;
    }
   
    
  }
  
</style>

