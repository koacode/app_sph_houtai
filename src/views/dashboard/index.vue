<template>
  <div>
    <Card/>
    <SaleRoom/>
    <Observe/>
  </div>
</template>

<script>
import Card from './Card/Card.vue'
import SaleRoom from './SaleRoom/SaleRoom.vue'
import Observe from './Observe/index.vue'
export default {
  name: 'Dashboard',
  components:{Card, SaleRoom, Observe},
  mounted(){
    this.$store.dispatch('getData')
  }
}
</script>

<style>
</style>
