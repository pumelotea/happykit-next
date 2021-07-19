<template>
  <el-menu-item v-if="data.isRouter && !data.hide" :index="data.menuId">
    <template #title>
      <i :class="data.icon"></i>
      <span>{{ data.name }}</span>
    </template>
  </el-menu-item>

  <el-submenu :index="data.menuId" v-else-if="!data.isRouter && !data.hide">
    <template #title>
      <i :class="data.icon"></i>
      <span>{{ data.name }}</span>
    </template>
    <hb-menu-content v-for="e in data.children" :data="e" :key="e.menuId" />
  </el-submenu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Object
    }
  },
  name: 'HbMenuContent'
})
</script>
