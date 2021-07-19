<template>
  <div class="data-code" v-highlight>
    <h2>面包屑数据</h2>
    <pre>$happykit.getBreadcrumb()</pre>
    <pre>{{data}}</pre>
  </div>
</template>

<script lang="ts">
import $happykit from '@/framework'
import {defineComponent} from "vue"

export default defineComponent({
  setup(){
    const data = $happykit.getBreadcrumb()
    return {
      data
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
