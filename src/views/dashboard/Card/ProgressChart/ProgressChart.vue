<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'BarChart',
  mounted(){
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis:{
        // 隐藏x轴
        show:false,
        // 最小值与最大值的设置
        min:0,
        max:100,
      },
      yAxis:{
        // 隐藏y轴
        show:false,
        type:'category'
      },
      series:{
        type:'bar',
        data:[78],
        color:'yellowgreen',
        // 柱状图的宽度
        barWidth:'10px',
        // 背景颜色的设置
        showBackground:true,
        // 设置背景颜色
        backgroundSty:{
          color:'#eee',
        },
        // 文本标签
        label:{
          show:true,
          // 改变文本内容
          formatter:'|',
          // 文本标签位置调试
          position:'right',
          // 设置文本标签的颜色
          color:'yellowgreen'
        }
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
  }
}
</script>

<style>
.charts{
  width: 100%;
  height: 100%;
}
</style>