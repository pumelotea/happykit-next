<template>
  <div class="data-code">
    <h2>面包屑数据</h2>
    <pre>$happykit.getBreadcrumb()</pre>
    <h3>结果</h3>
    <el-button @click="out">在控制台输出</el-button>
  </div>
</template>

<script lang="ts">
import $happykit from '@/framework'
import {defineComponent} from "vue"

export default defineComponent({
  setup(){
    const data = $happykit.getBreadcrumb()

    function out(){
      console.log(data)
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
