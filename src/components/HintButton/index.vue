<template>
  <a :title="title" style="margin:0 4px">
    <el-button v-bind="$attrs"></el-button>
  </a>
</template>

<script>
export default {
  name:'HintButton',
  props:['title']
}
</script>

<style>

</style>