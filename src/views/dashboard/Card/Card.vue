<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个卡片 -->
          <Detail title="总销售额" :count="`￥${listState.salesTotal}`">
            <template slot="charts">
              <div style="padding-top:20px" class="percent">
                <span>周同比 {{listState.salesGrowthLastWeek}}%</span><svg t="1670328619910" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4586" width="16" height="16"><path d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="4587" fill="#d81e06"></path></svg>
                <span class="span">日同比 {{listState.salesGrowthLastDay}}%</span><svg t="1670328694117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4843" width="16" height="16"><path d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4844" fill="#1afa29"></path></svg>
              </div>
            </template>
            <template slot="footer">
              <span>日销售额￥{{listState.salesToday}}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第二个卡片 -->
          <Detail title="访问量" :count="listState.visitTotal">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量 {{listState.visitToday}}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第三个卡片 -->
          <Detail title="支付笔数" :count="listState.payTotal">
            <template slot="charts">
              <bar-chart></bar-chart>
            </template>
            <template slot="footer">
              <span>转化率 {{listState.payRate}}%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第四个卡片 -->
          <Detail title="运营活动效果" :count="`${listState.activityRate}%`">
            <template slot="charts">
              <progress-chart></progress-chart>
            </template>
            <template slot="footer">
              <div class="percent" style="height:15px">
                <span>周同比 {{listState.activityGrowthLastWeek}}%</span><svg t="1670328619910" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4586" width="16" height="16"><path d="M65.582671 735.208665l446.417329-446.41733 446.417329 446.41733z" p-id="4587" fill="#d81e06"></path></svg>
                <span class="span">日同比 {{listState.activityGrowthLastDay}}%</span><svg t="1670328694117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4843" width="16" height="16"><path d="M65.582671 288.791335l446.417329 446.41733 446.417329-446.41733z" p-id="4844" fill="#1afa29"></path></svg>
              </div>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from './BarChart/BarChart.vue'
import Detail from './Detail/Detail.vue'
import LineChart from './LineChart/LineChart.vue'
import ProgressChart from './ProgressChart/ProgressChart.vue'
import {mapState} from 'vuex'
export default {
  name:'Card',
  components:{Detail, LineChart, BarChart, ProgressChart},
  computed:{
    ...mapState({
      listState:state=>state.home.list
    })
  }
}
</script>

<style scoped>
.span{
  margin-left:5px;
}
svg{
  margin-left:1px
}
.percent{
  display:flex;
  align-items:center;
}
</style>