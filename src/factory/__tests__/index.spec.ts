import { createDefaultPageIdFactory, createDefaultTrackerIdFactory, createEmptyMenuItem } from '../index'
import { MenuItem } from '../../types'
import { createHappyFramework } from '../../framework'
import { getHash } from '../../utils'
import { createApp, defineComponent } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'

test('createEmptyMenuItem', () => {
  const menuItem = createEmptyMenuItem()
  expect(menuItem).toEqual({
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
  })
})

test('defaultTrackerIdFactory', () => {
  const defaultTrackerIdFactory = createDefaultTrackerIdFactory(createHappyFramework())
  expect(defaultTrackerIdFactory.getId().length).toBe(16)
})

test('defaultPageIdFactory', async () => {
  // 准备环境
  const app = createApp({
    template: '<div></div>',
  })
  const framework = createHappyFramework()
  const Foo = defineComponent({
    template: `<div>foo</div>`,
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: Foo,
      },
      {
        path: '/path',
        component: Foo,
      },
    ],
  })
  const defaultPageIdFactory = createDefaultPageIdFactory(framework)
  const to = { path: '/path', query: { id: 1 } }
  // 测试id生成器是否达到预期
  expect(defaultPageIdFactory.generate('/path')).toBe(getHash('/path'))

  // 测试未装载框架到app是否会报错
  expect(() => {
    defaultPageIdFactory.getNextPageId(to)
  }).toThrow('getNextPageId:router instance is null')

  app.use(framework)

  // 测试路由未装载到app是否报错
  expect(() => {
    defaultPageIdFactory.getNextPageId(to)
  }).toThrow('getNextPageId:router instance is null')

  app.use(router)
  await router.isReady()

  const idObject = {
    name: undefined,
    path: '/path',
    query: { id: '1' },
    params: {},
  }

  expect(getHash(JSON.stringify(idObject))).toBe(defaultPageIdFactory.getNextPageId(to))
})
