<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"/>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin:0 3px">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="valueName" label="属性值名称" width="width">
            <!-- row是attrInfo.attrValueList这个数组中的选中的那一项，$index是attrInfo.attrValueList这个数组中选中的那一项的index值(0,1,2...) -->
            <template slot-scope="{row,$index}">
              <!-- 这里的结构需要用到span和input来回切换 -->
              <el-input
                v-model="row.valueName" 
                placeholder="请输入属性值名称" 
                size="mini" 
                v-if="row.flag" 
                @blur="toLook(row)" 
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- 为什么下面没有涉及到组件之间传递数据为什么要用到作用域插槽呢？？？ -->
            <!-- 因为这里涉及到了父子组件之间通信，需要用作用域插槽来传递数据row，在事件回调中需要传递数据 -->
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[], // 接收平台属性的字段,attrList是一个数组，数组中的每一个元素都是对象，数组中的每一项元素的结构和attrInfo类似
      isShowTable:true, // 这个属性控制table表格的显示与隐藏：为true时，展示平台属性的结构；为false时，展示添加或修改属性的结构
      // 收集新增属性|修改属性使用的
      attrInfo:{
        attrName:'', //属性名
        attrValueList:[], //属性值，因为属性值可以有多个，因此用数组,每一个属性值都是一个对象，需要attrId和valueName
        categoryId:0, //三级分类的id
        categoryLevel:3 //因为服务器也需要区分几级id
      }
    }
  },
  methods:{
    // 自定义事件的回调
    getCategoryId({categoryId,level}){
      // 区分三级分类相应的id，以及父组件进行存储
      if(level==1){
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      }else if(level==2){
        this.category2Id = categoryId
        this.category3Id = ''
      }else{
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求获取平台的属性数据
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    // 当用户确定三级分类的数据的时候，可以向服务器发请求获取平台属性进行展示
    async getAttrList(){
      const {category1Id,category2Id,category3Id} = this
      let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
      if(result.code===200){
        this.attrList = result.data
      }
    },
    // 添加属性按钮的回调
    addAttr(){
      // 切换table的显示与隐藏
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:3
      }
    },
    // 修改某一个属性
    updateAttr(row){
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      // 由于数据结构当中存在对象里面套数组，数组里面有对象，因此需要深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.some(item=>{
        // item.flag = false // 这样书写也可以给属性值添加flag字段，但是会发现视图不会跟着变化（因为flag不是响应式数据）,因为vue无法探测普通的新增property，这样书写的属性并非响应式属性（响应式属性是数据变化视图跟着变化）
        this.$set(item,'flag',false)
      })
    },
    // 添加属性值的回调(这里包含了是添加属性中的添加属性值以及修改属性中的添加属性值)
    addAttrValue(){
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.id, //如果是添加属性中的添加属性值，则不存在attrInfo.id,因此添加属性时正好是undefined; 如果是修改属性中的修改属性值，则已经存在属性id了，则把attrInfo.id赋值给attrId，
        valueName:'',
        flag:true,
      })
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    // 失去焦点的事件---切换为查看模式，展示span
    // row形参是当前用户添加的最新的属性值，即:data="attrInfo.attrValueList"数组当中的一项
    // 其实Attr这里的input和span切换的函数和SpuForm那里的input和button切换是一模一样的，keyup.enter.native如果满足条件的话函数将会执行两次，
    // 但是这里不会满足条件依然提示message是因为这里的valueName不是一个数组，而是字符串，结构和那里不一样，它没有和自己的属性值名称比
    toLook(row){
      // console.log(111) //如果是keyup.enter.native触发，那么这行代码会执行两次，因为enter触发之前会先触发blur函数导致两次执行toLook函数。所以如果是如果是keyup.enter.native触发，这行代码要么执行一次（不满足条件的情况），要么执行两次（满足条件）
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if(row.valueName.trim()==''){
        this.$message('请你输入一个正常的属性值')
        return;  //这里return的作用是跳出当前函数，不再执行下面的代码了，即如果进入了if循环，就不再继续执行 row.flag = false 了(不让input变为span)
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some(item=>{
        // 因为 row!=item 这行代码，所以不会没有重复依然提示message，因为它没有和自己比，这行代码间接表名只有当id值不一样时，才做比较
        if(row!=item){
          // rows是我鼠标当前点击的这一项，item是数组里面的每一项
          // 只要row对象中的属性valueName的属性值与item中的任一项的属性valueName的属性值相等，就返回true
          // 即只要满足有一项 row.valueName==item.valueName 就返回true
          return row.valueName==item.valueName
        }
      })
      // 主要有一项属性值相等，就跳出当前函数，不再执行以下代码
      if(isRepat){
        this.$message('不能输入重复的属性值')
        return;
      }
      // console.log(222) //如果是keyup.enter.native触发，没有重复并且不为空而满足条件的话，这行代码将不会执行，所以这行代码如果是keyup.enter.native触发，要么不执行，要么执行两次
      row.flag = false
    },
    // 点击span的回调变回编辑模式
    toEdit(row,index){
      row.flag=true
      // 获取input焦点，实现自动聚焦
      // 需要注意，点击span的时候，切换input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重排是需要耗时间的
      // $nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(()=>{
        this.$refs[index].focus()
        console.log(this.$refs[index])
      })
    },
    // 气泡确认框确定按钮的回调
    // 最新版本的ElementUI----2.15.11，目前版本2.13.2
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdateAttr(){
      // 整理参数：
      // 1）如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      // 2）提交给服务器当中的数据中不应该出现flag字段
      this.attrInfo.attrValueList.filter(item=>{
        // 过滤出来属性值不是空的，过滤出来的数据数需要的数据
        if(item.valueName!=''){
          // 删除flag属性
          delete item.flag
          return true //这里为什么要返回true
        }
      })
      try{
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 展示平台属性的信号量进行切换
        this.isShowTable = true
        // 提示消息
        this.$message({type:'success',message:'保存成功'})
        // 保存成功之后需要再次获取平台属性进行展示
        this.getAttrList()
      }catch(error){
        this.$message('保存失败')
      }
      
    }
  },
}
</script>

<style>

</style>