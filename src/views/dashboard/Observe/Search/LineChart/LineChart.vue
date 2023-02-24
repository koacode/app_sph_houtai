<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <svg t="1670327233604" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2673" width="20" height="20"><path d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z" p-id="2674" fill="#707070"></path></svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <svg t="1670328619910" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4586" width="16" height="16"><path d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="4587" fill="#d81e06"></path></svg>
      <svg t="1670328694117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4843" width="16" height="16"><path d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4844" fill="#1afa29"></path></svg>
    </div>
    <div class="footer">
      <!-- 容器 -->
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'LineChart',
  mounted(){
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
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
        data:[10,30,18,28,49,37,50,28,58,40],
        // 拐点样式的设置
        itemStyle:{
          opacity:0
        },
        // 线条的样式
        lineStyle:{
          color:'#819EEE'
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
                color:'#819EEE', // 0%处的颜色
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
  }
}
</script>

<style scoped>
.header{
  display:flex;
  align-items:center;
  color: #949494;
}
.search-header{
  margin-right: 8px;
  font-size: 14px;
}
.main{
  padding: 15px 0;
  display:flex;
  align-items:center;
}
.main-title{
  font-size: 28px;
  margin-right: 20px;
  color: #4B4B4B;
}
.main-content{
  margin-right: 3px;
  color: #908886;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>