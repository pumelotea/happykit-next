<template>
  <div class="data-code" v-highlight>
    <h2>Security</h2>
    <h3>用户信息</h3>
    <pre>{{user}}</pre>
    <h3>Token</h3>
    <p>Token不是响应式数据</p>
    <el-button @click="getToken">获取数据</el-button>
    <pre>{{token}}</pre>
  </div>
</template>

<script lang="ts">
import happySecurity from '@/security'
import {defineComponent, ref} from "vue"

export default defineComponent({
  setup(){
    happySecurity.signIn("token-1111", {})
    const user = happySecurity.getUser()
    const token = ref(happySecurity.getToken())
    function getToken(){
      token.value = happySecurity.getToken()
    }

    return {
      user,
      token,
      getToken
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
