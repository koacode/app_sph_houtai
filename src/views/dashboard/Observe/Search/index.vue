<template>
  <div>
    <el-card>
      <div slot="header" class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineChart></LineChart>
          </el-col>
          <el-col :span="12">
            <LineChart></LineChart>
          </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table :data="searchWord" border style="margin-top:12px">
          <el-table-column type="index" label="排名" width="80" align="center">
          </el-table-column>
          <el-table-column prop="word" label="搜索关键字" width="180">
          </el-table-column>
          <el-table-column prop="user" label="用户数" sortable>
          </el-table-column>
          <el-table-column prop="count" label="周涨幅" sortable>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination layout="->, prev, pager, next" :total="1000"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineChart from "./LineChart/LineChart.vue";
import {mapState} from 'vuex'
export default {
  name: "Search",
  components: { LineChart },
  computed:{
    ...mapState({
      searchWord:state=>state.home.list.searchWord
    }),
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
</style>