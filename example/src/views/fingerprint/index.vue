<template>
  <div v-highlight>
    <h2>浏览器指纹</h2>
    <input>
    <h3>原理</h3>
    <p>
      指纹通过canvas进行计算得到，
      指纹并不是绝对唯一的，但是可以代表大部分情况。
    </p>
    <h3>调用</h3>
    <pre>$happykit.getTracker().clientId</pre>
    <h3>结果</h3>
    <pre>{{clientId}}</pre>
  </div>
</template>

<script lang="ts">
import $happykit from '@/framework'
import {defineComponent} from "vue"

export default defineComponent({
  setup(){
    const clientId = $happykit.getTracker().clientId

    return {
      clientId
    }
  }
})
</script>

<style scoped>

</style>
