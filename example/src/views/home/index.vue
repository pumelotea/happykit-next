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
          <router-view v-slot="{ Component,route }">
            <route-alive :is='Component' :route='route'></route-alive>
<!--            <keep-alive>-->
<!--              <component-->
<!--                :is="Component">-->
<!--              </component>-->
<!--            </keep-alive>-->
<!--            <transition name="slide-fade">-->
<!--              <component-->
<!--                v-if="pageId"-->
<!--                :is="Component"-->
<!--                :pageId="pageId"-->
<!--                :isKeepalive="isKeepalive"-->
<!--                :key="pageId"></component>-->
<!--            </transition>-->
          </router-view>
        </template>
      </hb-main-layout>
    </div>
  </div>
</template>
<script lang="ts">
import HbMainLayout from "../../components/HbMainLayout.vue"
import HbNavBar from "../../components/HbNavBar.vue"
import HbMenuList from "../../components/HbMenuList.vue"
import {defineComponent, ref, watch} from "vue"
import $happykit from '@/framework'
import {useRouter} from "vue-router"
import {injectRoutes, createDefaultMenuAdapter, resetFramework, upgradeRouter,RouterInjectOption} from "happykit"
import {RouteAlive} from '@/router'
// @ts-ignore
import routerData from '../../routerData'
import happySecurity from "@/security";

export default defineComponent({
  components: {HbMainLayout, HbNavBar, HbMenuList,RouteAlive},
  setup() {
    const pageId = ref('')
    const isKeepalive = ref(false)
    const router = useRouter()
    const dataAdapter = createDefaultMenuAdapter()

    const update = () => {
      pageId.value = $happykit.getCurrentMenuRoute().value?.pageId || ''
      isKeepalive.value = $happykit.getCurrentMenuRoute().value?.menuItem.isKeepalive || false
    }

    watch(router.currentRoute, () => {
      update()
    })

    function loadData() {
      $happykit.setMenuTree(routerData, dataAdapter)
      const routerInjectOption:RouterInjectOption = {
        router,
        parentRoute: {
          name: 'home',
          path: '/home',
          component: () => import('@/views/parent'!)
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
      flushStorage,
      pageId,
      isKeepalive
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
