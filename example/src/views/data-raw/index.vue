<template>
  <div class="data-code" v-highlight>
    <h2>原始数据</h2>
    <p>这个数据大部分情况是从服务端的返回。</p>
<!--    <pre>{{navList}}</pre>-->
  </div>
</template>

<script lang="ts">
import $happykit from '@/framework'
import {defineComponent} from "vue"

export default defineComponent({
  setup(){
    const navList = $happykit.getNavList()

    return {
      navList
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
