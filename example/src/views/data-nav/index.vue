<template>
  <div class="data-code">
    <h2>导航数据</h2>
    <h3>调用</h3>
    <pre>$happykit.getNavList()</pre>
    <h3>结果</h3>
    <el-button @click="out">在控制台输出</el-button>
  </div>
</template>

<script lang="ts">
import $happykit from '@/framework'
import {defineComponent} from "vue"

export default defineComponent({
  setup(){
    const navList = $happykit.getNavList()
    function out(){
      console.log(navList)
    }
    return {
      out
    }
  }
})
</script>

<style scoped>
.data-code{
  overflow: auto;
  height: 100%;
}
</style>
