<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <!--  @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="data"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="sale-charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{title}}排名</h3>
          <ul class="sale-ul">
            <li v-for="r in rank" :key="r.id">
              <span :class="{rindex:r.no<4}" :style="{margin:r.no<4?'0 20px 0 0':'0 25px 0 5px'}">{{r.no}}</span>
              <span>{{r.name}}</span>
              <span class="rvalue">{{r.money}}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default {
  name: "SaleRoom",
  data() {
    return {
      activeName:'sale',
      myChart:null,
      data:[], // 收集日历的数据
    }
  },
  mounted(){
    // 初始化echarts实例
    this.myChart = echarts.init(this.$refs.charts)
    this.myChart.setOption({
      title:{
        text:'销售额趋势',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          //显示Y轴的线
          axisLine:{
            show:true
          },
          //显示Y轴刻度
          axisTick:{
            show:true
          }
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
        }
      ]
    })
  },
  computed:{
    // 计算属性-标题
    title(){
      return this.activeName == 'sale' ? '销售额':'访问量'
    },
    ...mapState({
      listState:state=>state.home.list
    }),
    rank(){
      return this.title=='销售额'?this.listState.orderRank:this.listState.userRank
    }
  },
  // 监听属性
  watch:{
    title(){
      // 重新修改图表的配置数据
      // 图表配置数据可以再次修改，如果有新的数值，那就用新的数值，如果没有新的数值，那就用以前的数值
      this.myChart.setOption({
        title:{
          text:this.title + '趋势',
        },
        xAxis:{
          data:this.title=='销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis,
        },
        series:{
          data:this.title=='销售额'?this.listState.orderFullYear:this.listState.userFullYear,
        }
      })
    },
    listState(){
      this.myChart.setOption({
        xAxis:{
          data:this.listState.orderFullYearAxis
        },
        series:{
          data:this.listState.orderFullYear
        }
      })
    }
  },
  methods:{
    // 今日
    setDay(){
      const day = dayjs().format()
      this.data = [day,day]
    },
    // 本周
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.data = [start,end]
    },
    // 本月
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.data = [start,end]
    },
    // 本年
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.data = [start,end]
    }
  }
};
</script>

<style>
.box-card{
  margin:10px 0;
}
.box-card .el-card__header{
  border-bottom: none;
}
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab{
  width: 100%;
  font-size: 20px;
}
.right{
  position: absolute;
  right: 0;
}
.date{
  width: 220px!important;
  margin: 0 20px;
}
.right span{
  margin: 0 10px;
  font-size: 14px;
}
.sale-charts{
  width: 100%;
  height: 300px;
}
.sale-ul{
  list-style: none;
  width: 100%;
  height: 260px;
  padding: 0;
}
.sale-ul li{
  height: 12%;
  font-size: 14px;
}
.sale-ul li .rindex{
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: black;
  color: white;
  margin-right: 20px;
  text-align: center;
  line-height: 18px;
  display: inline-block;
  vertical-align: middle;
}
.sale-ul li .rindex-noicon{
  margin: 0 24px 0 4px;
}
.sale-ul li .rvalue{
  float: right;
}
</style>