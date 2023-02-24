<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
import {mapState} from 'vuex'
export default {
  name:'BarChart',
  data() {
    return {
      barCharts:null
    }
  },
  mounted(){
    // 初始化echarts实例
    this.barCharts = echarts.init(this.$refs.charts)
    this.barCharts.setOption({
      xAxis:{
        // 隐藏x轴
        show:false,
        type:'category'
      },
      yAxis:{
        // 隐藏y轴
        show:false
      },
      series:{
        type:'bar',
        data:this.listState.payTrend,
      },
      // 布局调试
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0,
      },
      // 提示
      tooltip:{}
    })
  },
  computed:{
    ...mapState({
      listState:state=>state.home.list
    })
  },
  watch:{
    listState(){
      this.barCharts.setOption({
        series:{
          data:this.listState.payTrend,
        }
      })
    }
  }
}
</script>

<style>
.charts{
  width: 100%;
  height: 100%;
  bottom:5px
}
</style>