<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <!-- 
      表格组件
      data:表格组件将来需要展示数据----数组类型
      border:给表格添加边框
      column属性
      label:显示标题
      width:对应的宽度
      align:标题对齐的方式
      prop:对应列内容的字段名
      注意1:elmentUI当中的table组件展示的数据是一列一列进行展示数据
     -->
    <el-table style="width: 100%; margin-top: 20px" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center"></el-table-column>
      <el-table-column label="品牌logo" width="width" align="center">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="200px" align="center">
        <template slot-scope="{row}"> 
          <!-- 下面的代码中没有用到row，这里还需要 slot-scope="{row}" 吗 -->
          <!-- 需要！！因为再click绑定的事件回调中传递了row参数，因此需要书写 slot-scope="{row}" -->
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器:当前第几页、数据总条数、每一页展示的条数、连续页码数
      current-page:代表的是当前第几页
      total:代表分页器一共需要展示多少条数据
      page-size:代表的是每一页需要展示多少条数据
      page-count:按钮的数量,连续的页码数是 page-count-2
      page-sizes:代表可以设置每一页展示多少条数据(可以切换)
      layout:可以实现分页器的布局
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 
      对话框
      visible.sync:控制对话款的显示与隐藏
     -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 -->
      <el-form style="width: 88%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            这里收集数据不能使用v-model，因为不是表单元素
            action：设置图片上传的地址
            on-success：可以检测到图片是否上传成功，当图片上传成功，会执行一次
            before-upload：可以在图片上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1, //代表分页器第几页
      limit: 3, //当前页数展示 多少条数据
      total: 0, //总共数据条数
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框显示与隐藏控制的属性
      // 收集品牌信息:对象身上的属性不能瞎写，需要看文档
      tmForm:{
        tmName:'',
        logoUrl:''
      },
      // 表单的验证规则
      rules:{
        // 品牌名称的验证规则
        // require:必须要校验的字段(和前面的红色星号有关)
        // message:提示信息
        // trigger:用户的行为设置(事件的设置:blur【失焦】、change)
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌logo的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌的图片'}
        ],
      }
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager;
      // 解构出参数
      const { page, limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        // 数据的总条数
        this.total = result.data.total;
        // 列表展示的数据
        this.list = result.data.records;
      }
    },
    // 当分页器某一页需要展示数据的条数发生变化的时候会触发
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = {tmName:'',logoUrl:''}
    },
    // 修改某一个品牌
    // row:当前用户选中这个品牌的品牌信息
    updateTradeMark(row) {
      // 显示对话框
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给tmForm进行展示
      this.tmForm = {...row} //这里完全没懂为什么要这么操作
    },
    // 图片上传成功
    // res:上传成功之后返回前端数据
    // file:上传成功之后服务器返回前端数据
    handleAvatarSuccess(res, file) {
      // 收集品牌图片的数据,因为将来需要带给服务器
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M; //这里return的意义是什么呢???
    },
    // 添加或修改按钮的回调(添加品牌|修改品牌)
    addOrUpdateTradeMark(){
      // 当全部验证字段通过,再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success)=>{
        if(success){
          this.dialogFormVisible = false
          // 发请求(添加品牌|修改品牌)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if(result.code===200){
            // 弹出信息:添加品牌成功|修改品牌成功
            this.$message({
              type:'success',
              message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
            })
            // 添加或者修改品牌成功之后,需要再次获取品牌列表进行展示
            this.getPageList(this.tmForm.id?this.page:1)
          }
        }else{
          console.log('error submit!!')
          return false 
        }
      }) 
    },
    // 删除品牌的操作
    deleteTradeMark(row){
      // 弹框
      this.$confirm(`你确定删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 当用户点击确定按钮的时候会触发
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        // 如果删除成功
        if(result.code === 200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length>1?this.page:this.page-1)
        }
      }).catch(() => {
        // 当用户点击取消按钮的时候会触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>