<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="质量(千克)">
        <el-input placeholder="质量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" width="80" type="selection"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" v-if="row.isDefault==0" @click="changeDefault(row)">设为默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="label">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [], //存储图片的信息(服务器返回来的数据)
      spuSaleAttrList: [], //存储销售属性的数据
      attrInfoList: [], //存储平台属性的数据
      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 第三类：需要自己书写代码、
        skuDefaultImg: "", //默认图片
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 平台属性的字段
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 销售属性的字段
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu:{},
      imageList:[], //收集图片数据的字段(用户选中的图片的数据)：但是需要注意，手机的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImageLIst(spu.id);
      if (result.code == 200) {
        let list = result.data;
        // 给服务器返回的图片的数据添加isDefault字段
        list.forEach(item=>{
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params){
      // 获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imageList = params
    },
    // 排它操作 
    changeDefault(row){
      // 图片列表的数据的isDefault字段的变为 0
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      // 点击的那个图片的数据的isDefault字段变为 1
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的回调
    cancel(){
      // 触发自定义事件，让父组件切换场景0
      this.$emit('changeScenes',0)
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 保存按钮的回调
    async save(){
      const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this
      // 整理数据方式一：
      /* // 新建数组
      let arr = []
      // 把收集到的数据整理一下
      attrInfoList.forEach(item=>{
        // 当前平台用户进行选择
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          let obj = {attrId,valueId}
          arr.push(obj)
        }
      })
      // 将整理好的参数赋值给skuInfo.skuAttrValueList
      this.skuInfo.skuAttrValueList = arr */
      // 整理数据方式二：
      // 整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev;
      },[])
      // 整理销售属性的数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev;
      },[])
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imageName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if(result.code==200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit('changeScenes',0)
      }
    }
  },
};
</script>

<style>
</style>