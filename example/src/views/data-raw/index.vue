<template>
  <div class="data-code">
    <h2>原始数据</h2>
    <p>这个数据大部分情况是从服务端的返回。</p>
    <h3>结果</h3>
    <el-button @click="out">在控制台输出</el-button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
//@ts-ignore
import routerData from '../../routerData'
export default defineComponent({
  setup(){
    function out(){
      console.log(routerData)
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
