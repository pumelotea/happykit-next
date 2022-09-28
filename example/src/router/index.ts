import { createRouter, createWebHashHistory, NavigationFailure, RouteLocationRaw, Router } from 'vue-router'
import routes from '@/router/config'
import { beforeEachHandler, afterEachHandler } from '@/router/config'
import happyFramework from '@/framework'
import { upgradeRouter, useRouteAlive } from 'happykit'
import PlaceHolder from '@/views/PlaceHolder.vue'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})

// 升级路由
const happyKitRouter = upgradeRouter(happyFramework,router)

router.beforeEach(beforeEachHandler)
router.afterEach(afterEachHandler)

const {removeComponentCache, RouteAlive} = useRouteAlive({
  framework:happyFramework,
  router,
  placeHolderComponent:PlaceHolder
})

export {
  removeComponentCache,
  RouteAlive
}

export default happyKitRouter
