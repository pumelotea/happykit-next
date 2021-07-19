<template>
  <home></home>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
import Home from '@/views/home/index.vue'
export default defineComponent({
  name: 'App',
  components:{
    Home
  }
})
</script>
