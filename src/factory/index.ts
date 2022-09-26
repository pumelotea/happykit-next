import {
  HAPPYKIT_INJECT,
  HAPPYKIT_STORAGE,
  NAV_TITLE,
  HAPPYKIT_PARENT_ROUTE,
  HappyKitFramework,
  HappyKitRouter,
  MenuAdapter,
  MenuItem,
  PageIdFactory,
  RouterInjectOption,
  RouterInterceptor,
  RouterInterceptorOption,
  TrackerIdFactory,
  HappyKitRouteCache,
  HappyKitRouteCacheOption,
} from '../types'
import { deepClone, getCanvasFingerPrint, uuid, getHash } from '../utils'
import { NavigationFailure, RouteLocationNormalizedLoaded, RouteLocationRaw, Router } from 'vue-router'
import { reactive, ref, watch, h, markRaw, defineComponent, KeepAlive, toRaw, Component, DefineComponent } from 'vue'

/**
 * 工厂
 * 提供通用方法
 */

/**
 * 创建空的菜单项
 */
export function createEmptyMenuItem(): MenuItem {
  return {
    menuId: '',
    name: '',
    icon: '',
    path: '',
    view: '',
    isRouter: false,
    isKeepalive: false,
    type: 'menu',
    externalLink: false,
    linkTarget: 'tab',
    externalLinkAddress: '',
    hide: false,
    isHome: false,
    permissionKey: '',
    children: [],
    routerPath: '',
    menuPath: [],
    breadcrumb: [],
    pointList: [],
    pointsMap: new Map<string, MenuItem>(),
  }
}

/**
 * 创建默认的菜单数据适配器
 */
export function createDefaultMenuAdapter(): MenuAdapter<MenuItem> {
  return {
    convert(menuTree: any) {
      const routeMappingList: MenuItem[] = []
      const menuIdMappingMap = new Map<string, MenuItem>()
      const menuTreeConverted: MenuItem[] = []

      const menuTypeMap: any = {
        menu: 'menu',
        point: 'point',
      }

      const linkTargetMap: any = {
        _tab: 'tab',
        _self: 'self',
        _blank: 'blank',
      }

      const forEachTree = (tree: any[], pNode?: MenuItem) => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < tree.length; i++) {
          // 创建新的节点
          const treeNode = createEmptyMenuItem()
          treeNode.menuId = uuid()
          treeNode.name = tree[i].name || ''
          treeNode.path = tree[i].path || ''
          treeNode.icon = tree[i].icon || ''
          treeNode.view = tree[i].view || ''
          treeNode.isRouter = tree[i].isRouter || false
          treeNode.isKeepalive = tree[i].isKeepalive || false
          treeNode.type = tree[i].type || 'menu'
          treeNode.externalLink = tree[i].externalLink || false
          treeNode.linkTarget = linkTargetMap[tree[i].externalLink] || 'tab'
          treeNode.externalLinkAddress = tree[i].externalLinkAddress || ''
          treeNode.hide = tree[i].hide || false
          treeNode.isHome = tree[i].isHome || false
          treeNode.permissionKey = tree[i].permissionKey || ''

          if (!pNode) {
            pNode = createEmptyMenuItem()
            menuTreeConverted.push(pNode)
          }
          pNode.children.push(treeNode)
          // 拼接路由
          treeNode.routerPath = pNode.routerPath + treeNode.path
          // 预先生成菜单节点路径
          const tmpNode = deepClone(treeNode) as MenuItem
          tmpNode.children = []
          tmpNode.menuPath = []
          tmpNode.breadcrumb = []
          treeNode.menuPath = [...pNode.menuPath, tmpNode]
          // breadcrumb
          treeNode.breadcrumb = [...pNode.breadcrumb, tmpNode]

          // 记录id映射表
          menuIdMappingMap.set(treeNode.menuId, treeNode)

          if (treeNode.type === 'menu') {
            if (!treeNode.isRouter) {
              forEachTree(tree[i].children, treeNode)
            } else {
              // 收集权限点
              tree[i].children.forEach((e: any) => {
                const pointNode = createEmptyMenuItem()
                pointNode.menuId = uuid()
                pointNode.name = e.name || ''
                pointNode.path = e.path || ''
                pointNode.view = e.view || ''
                pointNode.isRouter = e.isRouter || false
                pointNode.isKeepalive = e.isKeepalive || false
                pointNode.type = menuTypeMap[e.type] || 'point'
                pointNode.externalLink = e.externalLink || false
                pointNode.linkTarget = linkTargetMap[e.externalLink] || 'tab'
                pointNode.externalLinkAddress = e.externalLinkAddress || ''
                pointNode.hide = e.hide || false
                pointNode.isHome = e.isHome || false
                pointNode.permissionKey = e.permissionKey || ''
                treeNode.pointList.push(pointNode)
                treeNode.pointsMap.set(pointNode.permissionKey, pointNode)
              })
              if (!treeNode.externalLink || (treeNode.externalLink && treeNode.linkTarget === 'tab')) {
                routeMappingList.push(treeNode)
              }
            }
          }
        }
      }
      forEachTree(menuTree as any[])
      return {
        routeMappingList,
        menuTreeConverted: menuTreeConverted[0]?.children || [],
        menuIdMappingMap,
      }
    },
  }
}

/**
 * 对对象根据key升序排序
 * @param source
 */
export function sortObject(source: any) {
  const target: any = {}
  Object.keys(source)
    .sort()
    .forEach((e) => {
      target[e] = source[e]
    })
  return target
}

function strToHexCharCode(str: string) {
  if (str === '') return ''
  const hexCharCode: string[] = []
  hexCharCode.push('0x')
  for (let i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16))
  }
  return hexCharCode.join('')
}

/**
 * 创建默认的页面ID生成工厂
 * @param framework 框架上下文
 */
export function createDefaultPageIdFactory(framework: HappyKitFramework): PageIdFactory {
  return {
    framework,
    generate(fullPath: string) {
      return getHash(fullPath)
    },
    getNextPageId(to: RouteLocationRaw) {
      const router: Router = this.framework.options.app?.config.globalProperties.$router
      if (!router) {
        throw Error('getNextPageId:router instance is null')
      }

      const route = router.resolve(to)

      const idObject = {
        name: route.name,
        path: route.path,
        query: sortObject(route.query),
        params: sortObject(route.params),
      }

      return this.generate(JSON.stringify(idObject))
    },
  }
}

/**
 * 创建默认的追踪Id生成工厂
 * @param framework
 */
export function createDefaultTrackerIdFactory(framework: HappyKitFramework): TrackerIdFactory {
  return {
    framework,
    getId(): string {
      return getHash(getCanvasFingerPrint('happykit.org'))
    },
  }
}

/**
 * 动态路由注入
 * @param options
 */
export function injectRoutes(options: RouterInjectOption) {
  const parentName = options.parentRoute.name
  if (!parentName) {
    throw Error('RouterInjectOption:parentRoute name is undefined')
  }

  if (options.parentRoute.meta) {
    options.parentRoute.meta._source = HAPPYKIT_INJECT
    options.parentRoute.meta._parentRoute = HAPPYKIT_PARENT_ROUTE
  } else {
    options.parentRoute.meta = {
      _source: HAPPYKIT_INJECT,
      _parentRoute: HAPPYKIT_PARENT_ROUTE,
    }
  }

  if (!options.router) {
    throw Error('RouterInjectOption:router is undefined')
  }

  // 注入父级路由
  options.router!.addRoute(options.parentRoute)
  // 注入子级路由
  options.routes.forEach((e) => {
    const route = {
      path: e.routerPath,
      name: options.randomName ? uuid() : e.name,
      component: options.viewLoader(e.view),
      meta: {
        _source: HAPPYKIT_INJECT,
        isKeepalive: e.isKeepalive,
        menuId: e.menuId,
        externalLinkAddress: e.externalLinkAddress,
      },
    }
    options.router!.addRoute(parentName, route)
  })
}

/**
 * 移除路由
 * @param router
 */
export function removeRoutes(router: Router) {
  router.getRoutes().forEach((e) => {
    if (e.name && e.meta._parentRoute === HAPPYKIT_PARENT_ROUTE) {
      router.removeRoute(e.name)
    }
  })
  router.getRoutes().forEach((e) => {
    if (e.name && e.meta._source === HAPPYKIT_INJECT) {
      router.removeRoute(e.name)
    }
  })
}

/**
 * 默认的重置框架方法
 * 并不是销毁框架
 * @param framework
 */
export function resetFramework(framework: HappyKitFramework) {
  framework.navigatorList.value = []
  framework.currentMenuRoute.value = null
  framework.menuTree.value = []
  framework.menuIdMappingMap.value.clear()
  framework.routerInitiated = false
  framework.routeMappingList.value = []
  // 尝试移除路由
  if (framework.options.app?.config.globalProperties.$router) {
    removeRoutes(framework.options.app?.config.globalProperties.$router)
  }
}

/**
 * 路由升级
 * vue-router升级为HappyKitRouter
 * @param router
 * @param framework
 */
export function upgradeRouter(framework: HappyKitFramework, router: Router): HappyKitRouter {
  return {
    ...router,
    framework,
    push(to: RouteLocationRaw, title?: string): Promise<NavigationFailure | void | undefined> {
      if (title) {
        const nextPageId = this.framework.options.pageIdFactory?.getNextPageId(to)
        if (!nextPageId) {
          throw Error('pageIdFactory is undefined')
        }
        localStorage.setItem(`${HAPPYKIT_STORAGE}/${NAV_TITLE}/${nextPageId}`, title)
      }
      return router.push(to)
    },
  }
}

/**
 * 创建默认的路由拦截器
 * @param options
 */
export function createDefaultRouterInterceptor(options: RouterInterceptorOption): RouterInterceptor {
  if (options.interceptorType === 'before') {
    return {
      options,
      async filter(to, from, next) {
        const framework = this.options.framework

        if (!next) {
          throw new Error('RouterInterceptor:next is undefined')
        }

        // 首次初始化
        if (!framework.routerInitiated) {
          if (!this.options.dataLoader) {
            throw Error('RouterInterceptor:dataLoader is undefined')
          }

          // 请求数据
          const result = await this.options.dataLoader(to, from, next)
          // 初始化失败
          if (!result.rawData) {
            this.options.dataLoadFailureHandler?.(result, to, from, next)
            return
          }
          // 初始化核心数据
          framework.setMenuTree(result.rawData)
          // 注入路由
          if (this.options.routerInjectOption) {
            this.options.routerInjectOption.router =
              this.options.routerInjectOption.router || framework.options.app?.config.globalProperties.$router

            // 备份用户设置的路由
            const list = [...this.options.routerInjectOption.routes]
            const ready: MenuItem[] = [...list, ...framework.getRouteMappingList().value]
            // 生成新的配置
            const opt = {
              ...this.options.routerInjectOption,
            }
            opt.routes = ready
            injectRoutes(opt)
          }
          // 初始化完成
          framework.routerInitiated = true
          // 跳转到目标路由
          const fun = this.options.routerInjectOption?.router?.push || next
          return fun(to.fullPath)
        }

        const menuId = to.meta.menuId

        // 非菜单项直接跳转
        if (!menuId) {
          next()
          return
        }
        const res = framework.getRouteMappingList().value.filter((e) => e.menuId === menuId)
        if (res.length === 0) {
          console.warn('RouterInterceptor:MenuItem is not found, nav failed')
          return
        }
        const menuItem = res[0]
        // 菜单项需要
        const navItem = framework.openNav(to, menuItem)
        framework.setCurrentMenuRoute(navItem)
        next()
      },
    }
  } else {
    return {
      options,
      filter(to, from) {
        console.warn('RouterInterceptor After: ', `${from.path} ---> ${to.path}`)
      },
    }
  }
}

export function useRouteAlive(options: HappyKitRouteCacheOption) {
  const framework = options.framework
  const router = options.router
  const placeHolderComponent = options.placeHolderComponent

  const currentMenuRoute = framework.getCurrentMenuRoute()
  // 缓存
  const cached = reactive<HappyKitRouteCache>({})
  const includes = ref<string[]>([])
  // when tabs changed, calc the includes
  watch(
    () => cached,
    () => {
      // delay update, because of current component's onUnmounted callback
      requestIdleCallback(() => {
        const tmp: string[] = []
        for (let cachedKey in cached) {
          if (cached[cachedKey].isKeepalive) {
            tmp.push(cachedKey)
          }
        }

        includes.value = tmp
      })
    },
    {
      deep: true,
    },
  )

  router.afterEach((to) => {
    if (!currentMenuRoute.value) {
      return
    }
    const isKeepalive = to.meta.isKeepalive === true
    const pageId = currentMenuRoute.value?.pageId
    if (cached[pageId]) {
      return
    }
    cached[pageId] = {
      pageId,
      isKeepalive,
      component: null,
    }
  })

  function reDefineComponent(component: Component, route: RouteLocationNormalizedLoaded) {
    if (!component) {
      return null
    }

    const current = currentMenuRoute.value
    if (!current) {
      return null
    }

    const pageId = current.pageId
    const componentCache = cached[pageId]
    if (componentCache && componentCache.component) {
      return h(componentCache.component as DefineComponent, { key: current.pageId })
    }

    const newComponent = markRaw(
      defineComponent({
        name: pageId,
        render: () => component,
      }),
    )
    // FIX:切换路由缓存容器中组件可能不存在
    if (!cached[pageId]) {
      if (placeHolderComponent) {
        return h(placeHolderComponent)
      }
      return null
    }

    cached[pageId].component = newComponent
    return h(newComponent, { key: current.pageId })
  }

  function removeComponentCache(pageId: string) {
    delete cached[pageId]
  }

  function getCached() {
    return cached
  }

  function getIncludes() {
    return includes
  }

  const RouteAlive = defineComponent({
    props: {
      is: {
        type: Object,
        require: true,
      },
      route: {
        type: Object,
        require: true,
      },
    },
    setup(props) {
      return () =>
        h(
          KeepAlive,
          { include: toRaw(includes.value) },
          { default: () => reDefineComponent(props.is as Component, props.route as RouteLocationNormalizedLoaded) },
        )
    },
  })

  return {
    RouteAlive,
    removeComponentCache,
    getCached,
    getIncludes
  }
}
