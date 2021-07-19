<template>
  <div class="main-layout">
    <div class="head-bar-slot">
      <slot name="head-bar"></slot>
    </div>
    <div class="nav-bar-slot uncollapse-left">
      <slot name="nav-bar"></slot>
    </div>
    <div class="menu-list-slot uncollapse-width-menu">
      <slot name="menu-list"></slot>
    </div>
    <div class="content-slot uncollapse-left">
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HbMainLayout'
})

</script>
<style scoped lang="scss">
.main-layout {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 20px;
  background: #FFFFFF;
  box-shadow: 0 0 6px 0px #0000002b;
  border-radius: 5px;
  overflow: hidden;

  .nav-bar-slot {
    left: 220px;
    top: 55px;
    right: 0;
    height: 50px;
    position: absolute;
    //background: $--color-white;
    padding-top: 4px;
  }

  .nav-bar-slot-disable {
    top: 60px !important;
  }

  .head-bar-slot {
    left: 0;
    position: absolute;
    top: 0;
    right: 0;
    height: 60px;
    background: #F5F7FA;
  }

  .menu-list-slot {
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 220px;
    background: #FFFFFF;
  }

  .menu-list-slot-disable {
    left: 0 !important;
  }


  .content-slot {
    position: absolute;
    left: 220px;
    right: 0;
    bottom: 0;
    top: 104px;
    margin: 5px;
    box-sizing: border-box;
  }

  .collapse-left {
    left: 64px;
    transition: all 0.2s ease-in-out;
  }

  .collapse-width-menu {
    width: 64px;
    transition: all 0.2s ease-in-out;
  }

  .uncollapse-left {
    left: 220px;
    transition: all 0.2s ease-in-out;
  }

  .uncollapse-width-menu {
    width: 220px;
    transition: all 0.2s ease-in-out;
  }
}


</style>
