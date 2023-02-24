<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
import {mapState} from 'vuex'
export default {
  name:'LineChart',
  data() {
    return {
      lineCharts:null
    }
  },
  mounted(){
    // 初始化echarts实例
    this.lineCharts = echarts.init(this.$refs.charts)
    this.lineCharts.setOption({
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
        type:'line',
        data:this.listState.visitTrend,
        // 拐点样式的设置
        itemStyle:{
          opacity:0
        },
        // 线条的样式
        lineStyle:{
          color:'#9264a9'
        },
        // 设置线条为光滑的、平滑的
        smooth:true,
        // 填充颜色的设置
        areaStyle:{
          color:{
            type:'line',
            x:0,
            y:0,
            x2:0,
            y2:1,
            colorStops:[
              {
                offset:0,
                color:'#9264a9', // 0%处的颜色
              },
              {
                offset:1,
                color:'#fff', // 100%处的颜色
              }
            ],
            global:false, // 缺省为false
          }
        }
      },
      // 布局调试
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0,
      }
    })
  },
  computed:{
    ...mapState({
      listState:state=>state.home.list
    })
  },
  watch:{
    listState(){
      this.lineCharts.setOption({
        series:{
          data:this.listState.visitTrend
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
}
</style>