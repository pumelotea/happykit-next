<template>
  <div class="data-code" v-highlight>
    <h2>菜单数据</h2>
    <h3>调用</h3>
    <pre>$happykit.getMenuTree()</pre>
    <h3>结果</h3>
<!--    <pre>{{list}}</pre>-->
  </div>
</template>

<script lang="ts">
import $happykit from '@/framework'
import {defineComponent} from "vue"

export default defineComponent({
  setup(){
    const list = $happykit.getMenuTree()

    return {
      list
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
