<template>
  <div class="case-content">
    <div class="page-content">
      <hb-main-layout>
        <template v-slot:head-bar>
          <div class="head-bar">Happykit Playground</div>
        </template>
        <template v-slot:nav-bar>
          <hb-nav-bar/>
        </template>
        <template v-slot:menu-list>
          <hb-menu-list/>
        </template>
        <template v-slot:content>
          <router-view/>
        </template>
      </hb-main-layout>
    </div>
    <div class="dev-form">
      <div class="group-item">
        <div class="group-name">初始化</div>
        <div>
          <el-button @click="loadData">加载数据</el-button>
          <el-button>查看数据源</el-button>
          <el-button @click="reset">重置框架</el-button>
        </div>
      </div>
      <div class="group-item">
        <div class="group-name">导航栏</div>
        <div class="nav-c-box">
          <div>
            <el-button @click="closeTabs(3)">关闭导航栏-全部</el-button>
          </div>
          <div>
            <el-button @click="closeTabs(0)">关闭导航栏-左侧</el-button>
          </div>
          <div>
            <el-button @click="closeTabs(1)">关闭导航栏-右侧</el-button>
          </div>
          <div>
            <el-button @click="closeTabs(2)">关闭导航栏-其他</el-button>
          </div>
          <div>
            <el-button @click="closeTabs(4)">关闭导航栏-当前路由</el-button>
          </div>
          <div>
            <el-button>跳转页面-普通</el-button>
          </div>
          <div>
            <el-button>跳转页面-自定义标题</el-button>
          </div>
          <div>
            <el-button>获取导航栏数据</el-button>
          </div>
          <div>
            <el-button>获取面包屑</el-button>
          </div>
        </div>
      </div>
      <div class="group-item">
        <div class="group-name">菜单</div>
        <div class="nav-c-box">
          <div>
            <el-button>获取菜单数据</el-button>
          </div>
          <div>
            <el-button>菜单点击事件</el-button>
          </div>
          <div>
            <el-button>隐藏菜单（路由）</el-button>
          </div>
        </div>
      </div>
      <div class="group-item">
        <div class="group-name">权限指令</div>
        <div class="nav-c-box">
          <div>
            <el-button>按钮权限</el-button>
          </div>
        </div>
      </div>
      <div class="group-item">
        <div class="group-name">指纹</div>
        <div class="nav-c-box">
          <div>
            <el-button>获取浏览器指纹（canvas）</el-button>
          </div>
        </div>
      </div>

      <div class="group-item">
        <div class="group-name">Security模块</div>
        <div class="nav-c-box">
          <div>
            <el-button @click="login">登录</el-button>
          </div>
          <div>
            <el-button @click="logout">登出</el-button>
          </div>
          <div>
            <el-button @click="refreshToken">刷新token</el-button>
          </div>
          <div>
            <el-button @click="getToken">获取token</el-button>
          </div>
          <div>
            <el-button @click="refreshUser">刷新用户信息</el-button>
          </div>
          <div>
            <el-button @click="getUserInfo">获取用户信息</el-button>
          </div>
          <div>
            <el-button @click="flushStorage">清空模块存储</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import HbMainLayout from "../../components/HbMainLayout.vue"
import HbNavBar from "../../components/HbNavBar.vue"
import HbMenuList from "../../components/HbMenuList.vue"
import {defineComponent} from "vue"
import $happykit from '@/framework'
import {useRouter} from "vue-router"
import {injectRoutes, createDefaultMenuAdapter, resetFramework, upgradeRouter,RouterInjectOption} from "happykit"

// @ts-ignore
import routerData from '../../routerData'
import happySecurity from "@/security";

export default defineComponent({
  components: {HbMainLayout, HbNavBar, HbMenuList},
  setup() {
    const router = useRouter()
    const dataAdapter = createDefaultMenuAdapter()

    function loadData() {
      $happykit.setMenuTree(routerData, dataAdapter)
      const routerInjectOption:RouterInjectOption = {
        router,
        parentRoute: {
          name: 'home',
          path: '/home',
          component: () => import('@/views/home'!)
        },
        routes: $happykit.getRouteMappingList().value,
        viewLoader(view) {
          //@ts-ignore
          return () => import(`@/views${view}`)
        }
      }
      injectRoutes(routerInjectOption)
      upgradeRouter($happykit,router)
    }

    function reset() {
      resetFramework($happykit)
    }

    const navList = $happykit.getNavList()
    const currentRouteMenu = $happykit.getCurrentMenuRoute()
    const closeTabs = (type: number) => {
      const tp: any = ['left', 'right', 'other', 'all', 'self']
      $happykit.closeNav(tp[type], currentRouteMenu.value?.pageId, (removedNavs: any, needNavs: any) => {
        if (needNavs.length > 0) {
          router.push(needNavs[0].to)
        }
        if (navList.value.length === 0) {
          router.push('/')
        }
      })
    }

    function login(){
      happySecurity.signIn('token-'+Date.now(),{
        name:'张三',
        email:'zs@qq.com',
        avatar:'link'
      })
    }

    function logout(){
      happySecurity.signOut()
    }

    function refreshToken(){
      happySecurity.refreshToken('token-'+Date.now())
    }

    function getToken(){
      alert(happySecurity.getToken())
    }

    function refreshUser(){
      happySecurity.refreshUser({
        name:'小米',
        email:'xm@qq.com',
        avatar:'link2'
      })
    }

    function getUserInfo(){
      alert(JSON.stringify(happySecurity.getUser().value))
    }

    function flushStorage(){
      happySecurity.flushStorage()
    }

    return {
      loadData,
      reset,
      closeTabs,
      login,
      logout,
      refreshToken,
      getToken,
      refreshUser,
      getUserInfo,
      flushStorage
    }
  }
})
</script>
<style>
.case-content {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
}

.head-bar {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  background-color: rgb(31 200 219);
  background-image: linear-gradient(72deg, rgb(33 245 88 / 30%) 0%, rgb(110 205 216 / 40%) 51%, rgb(85 184 255) 75%);
  color: white;
  font-size: 25px;
  font-weight: bold;
}

.page-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding: 20px;
  background: #F1F1F5;
}

.dev-form {
  width: 500px;
  overflow: auto;
  background: #f1f1f6;
}

.group-item {
  padding: 10px;
}

.group-name {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
}

.nav-c-box {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
}


</style>
