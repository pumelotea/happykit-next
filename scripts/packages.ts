export interface PackageManifest {
  name: string
  display: string
  addon?: boolean
  author?: string
  description?: string
  external?: string[]
  globals?: Record<string, string>
  manualImport?: boolean
  deprecated?: boolean
}

export const packages: PackageManifest[] = [
  {
    name: 'happykit',
    display: 'HappyKit',
    description: 'happykit next refactor width rollup',
    external: [
      'vue',
      '@vue/compiler-sfc',
      '@vue/compiler-sfc/dist/compiler-sfc.esm-browser',
      '@vue/shared',
      'vue-router'
    ],
    globals: {
      'vue': 'Vue',
      'vue-router':'VueRouter'
    }
  }
]

export const activePackages = packages.filter(i => !i.deprecated)
