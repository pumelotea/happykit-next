import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import http from '@/apis'
import eventBus from '@/common/eventBus'
import elementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
// 导入框架实例
import happyFramework from '@/framework'
import happySecurity from '@/security'


import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

const app = createApp(App)
app.use(elementPlus, { locale })
app.use(router)
app.use(http)
app.use(store)
app.use(eventBus)
app.directive('highlight', (el:any) => {
  const blocks = el.querySelectorAll('pre')
  blocks.forEach((block:any) => {
    hljs.highlightBlock(block)
  })
  // blocks = el.querySelectorAll('code')
  // blocks.forEach((block) => {
  //   hljs.highlightBlock(block)
  // })
})
// 作为插件安装
app.use(happyFramework)
app.use(happySecurity)
app.mount('#app')

