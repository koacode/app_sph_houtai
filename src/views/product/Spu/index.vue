<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 三级联动是全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!==0"/>
    </el-card>
    <el-card>
      <!-- 底部有三个部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column> 
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click.native="addSku(row)"></HintButton>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click.native="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click.native="handle(row)"></hint-button>
              <el-dialog :title="`${spu.spuName}的sku的列表`" :visible.sync="dialogTableVisible" :before-close="handleClose">
                <!-- table展示sku列表 -->
                <el-table :data="skuList" style="width: 100%" v-loading="loading">
                  <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
                  <el-table-column prop="price" label="价格" width="width"></el-table-column>
                  <el-table-column prop="weight" label="重量" width="width"></el-table-column>
                  <el-table-column prop="skuDefaultImg" label="默认图片" width="width">
                    <template slot-scope="{row}">
                      <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column> 
        </el-table>
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,total, sizes"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        <!--  -->
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm"
import SkuForm from "./SkuForm"
export default {
  name: 'Spu',
  components:{SpuForm,SkuForm},
  data() {
    return {
      // 分别是分类的id
      category1Id:'',
      category2Id:'',
      category3Id:'',
      page:1,//分页器当前第几页
      limit:3,//每一页需要展示多少条数据
      records:[],//spu列表的数据
      total:0,//分页器一共需要展示的条数
      scene:0,//0代表展示spu列表数据，1代表添加|修改spu，2代表添加sku
      dialogTableVisible:false, //控制查看SKU列表的 dialog 的显示与隐藏
      spu:{}, //保存spu的信息
      skuList:[], //存储的是sku列表的数据
      loading:true,
    }
  },
  methods:{
    // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    // categoryId：获取到一级、二级、三级分类的id     
    // level:为了区分是几级id
    getCategoryId({categoryId,level}){
      if(level==1){
        this.category1Id = categoryId
        // 清除二、三级分类的id
        this.category2Id = ''
        this.category3Id = ''
      }else if(level==2){
        this.category2Id = categoryId
        // 清除三级id
        this.category3Id = ''
      }else{
        this.category3Id = categoryId
        // 获取spu列表数据进行展示
        this.getSpuList()
      }
    },
    async getSpuList(pages=1){
      this.page = pages
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code===200){
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 当分页器的展示数据条数发生变化时
    handleSizeChange(limit){
      this.limit = limit
      this.getSpuList()
    },
    // 添加一个Spu
    addSpu(){
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个Spu
    updateSpu(row){
      this.scene = 1
      // 获取子组件SpuForm子组件得方法
      this.$refs.spu.innitSpuData(row)
    },
    // 取消按钮的自定义事件的回调
    changeScene({scene,flag}){
      this.scene = scene
      if(flag == '添加'){
        // 如果是添加，就跳转回第一页
        this.getSpuList()
      }else{
        this.getSpuList(this.page)
      }
    },
    // 删除spu的回调
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        this.$message({type:'success',message:'删除成功'})
        this.getSpuList(this.records.length>1 ? this.page : this.page-1)
      }
    },
    // 添加SKU按钮的回调
    addSku(row){
      // 切换场景为2
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求----三个请求
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    // skuForm通知父组件修改场景
    changeScenes(scene){
      this.scene = scene
    },
    // 查看SKU按钮列表的回调
    async handle(spu){
      // 点击这个按钮的时候，对话框是可见的
      this.dialogTableVisible = true
      // 保存spu信息
      this.spu = spu
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if(result.code==200){
        this.skuList = result.data
        // 隐藏loading
        this.loading = false
      }
    },
    // 关闭对话框的回调
    handleClose(done){
      // 把loading的值设置为true，可以在下次打开时又有loading效果
      this.loading = true
      // 清空服务器的数据
      this.skuList = []
      // 关闭dialog弹框
      done()
    }
  }
}
</script>

<style>

</style>