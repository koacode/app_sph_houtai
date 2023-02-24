<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          上传图片
          action：图片上传的地址
          list-type：文件列表的类型
          file-list：照片墙需要展示的数据【数组：数组里面务必要有name、url属性】
          on-preview：图片预览的时候会触发
          on-remove：删除图片的时候会触发
          on-success：图片上传成功时会触发
         -->
        <el-upload
          action="dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <!-- el-tag：用于展示已有的属性值列表的数据 -->
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{ tag.saleAttrValueName}}</el-tag>
              <el-input 
                class="input-new-tag" 
                v-if="row.inputVisible" 
                v-model="row.inputValue" 
                :ref="$index" size="small"
                @blur="handleInputConfirm(row)" 
                @keyup.enter.native="$event.target.blur">
              </el-input>
              <!--  @click="showInput"  -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row,$index)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu属性初始化的时候是一个空的对象,在修改spu的时候会向服务器发请求，返回spu信息(对象)，在修改的时候可以利用服务器返回的这个对象收集最新的数据交给服务器
      // 添加SPU：添加SPU的时候并没有向服务器发请求，所以需要看接口文档有哪些字段，再初始化字段
      spu: {
        category3Id: 0, //三级分类的id
        spuName: "", //spu的名称
        tmId: "", //品牌的id
        description: "", //描述
        // 收集spu图片的信息
        spuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          }, */
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      }, //存储spu信息属性
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片的数据
      saleAttrList: [], //销售属性的数据
      attrIdAndAttrName:'' //收集未选择的销售属性中用选择器选择的id和name
    };
  },
  methods: {
    // 照片墙图片预览时的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 照片墙删除某一个图片时会触发
    handleRemove(file, fileList) {
      // file：代表的是删除的那张图片
      // fileList：照片墙删除某一张图片后，剩余的其他的图片
      // 收集照片墙图片的数据
      // 对于已有的图片【照片墙中显示的图片：有name和url字段】，因为照片墙显示数据务必要有这两个属性
      // 对于服务器而言，不需要有name、url字段，将来对于已有的图片的数据提交服务器的时候，需要处理
      this.spuImageList = fileList
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response,file,fileList){
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 点击修改spu按钮时，发请求的函数----初始化SpuForm数据
    async innitSpuData(spu) {
      // 获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        let imgArr = spuImageResult.data;
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name和url字段，所以需要把服务器返回的数据进行修改
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给spuImageList
        this.spuImageList = imgArr;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加销售属性的按钮的回调（添加新的销售属性）
    addSaleAttr(){
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu对象的spuSaleAttrList属性里面添加新的属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 添加销售属性值按钮的回调
    addSaleAttrValue(row,index){
      // 点击销售属性值当中添加按钮的时候，需要有button变为input，通过当前销售属性的inputVisible进行控制
      // 挂载再销售属性身上的响应式数据inputValue，控制button与input的切换
      this.$set(row,'inputVisible',true)
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row,'inputValue','')
      this.$nextTick(()=>{
        console.log(index)
        this.$refs[index].focus()
      })
    },
    /* 添加按钮的input失去焦点的回调，失去焦点要干三件事：
    1）先判断是否符合条件，是否为空已经是否与已有的属性值重复，如果不符合要求，那么弹出提示信息，并且跳出改函数，即不执行该函数下的后续的代码了
    2）如果满足判断的条件，那么就把值存储进对象里面，然后再push进spuSaleAttrValueList数组里
    3）input框变为button按钮，即inputVisible的值变为false */
    handleInputConfirm(row){
      // console.log(row,"1")
      // 解构出销售属性当中收集的数据
      const {baseSaleAttrId,inputValue} = row
      // 新增的销售属性值名称不能为空
      if(inputValue.trim()==''){
        this.$message('属性值不能为空')
        return
      }
      // 新增的属性值不能重复
      // 当每一项的item.saleAttrValueName的值都不等于inputValue的时候，才返回true，只要有一项等于，就返回false
      /* let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      // 只要有一项等于，就返回false，所以当result为false时，跳出弹框提示信息
      if(!result){
        this.$message('不能输入重复的属性值')
        return
      } */
      // 只要有一项item.saleAttrValueName的值等于inputValue，就返回true，都不等于再返回false
      let result = row.spuSaleAttrValueList.some(item=>item.saleAttrValueName==inputValue)
      // 只要有一项item.saleAttrValueName的值等于inputValue，就返回true，所以当result为true的时候提示信息
      if(result){
        this.$message('不能输入重复的属性值')
        return;
      }
      // console.log(row,"2")
      // 新增的销售属性值结构
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      // 添加新的销售属性值
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible的值为false，即不显示input，显示button
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu(){
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带imgName与imgUrl字段
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url //这段的逻辑没有看懂？？？，这里用三元表达式会更好理解
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code===200){
        // 提示
        this.$message({type:'success',message:'保存成功'})
        // 通知父组件回到secen为0的场景
        this.$emit('changeScene', {scene:0,flag:this.spu.id?'修改':'添加'})
      } 
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id){
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮的回调
    cancel(){
      // 通知父组件切换场景为0
      this.$emit('changeScene', {scene:0,flag:''})
      // 清理数据
      // Object.assign：es6新增的方法，可以用来合并对象
      // 组件实例this._data,可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为最初始的数据
      Object.assign(this._data,this.$options.data())
    }
  },
  computed:{
    unSelectSaleAttr(){
      // 完整写法
      /* 
      let result = this.saleAttrList.filter(item=>{
        let everyResult = this.spu.spuSaleAttrList.every(item1=>{
          return item.name !== item1.saleAttrName //返回的结果是布尔值
        })
        // console.log(everyResult,'everyResult') //布尔值
        return everyResult //every函数返回的结果是布尔值
      })
      // console.log(result,'result') //满足条件的数组
      return result //filter函数返回的是满足条件的数组
       */
      // 简单写法
      return this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name !== item1.saleAttrName
        })
      })
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>