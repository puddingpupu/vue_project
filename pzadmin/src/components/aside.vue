<template>
  <el-menu
    :style="{
      width: !isCollapse ? '230px' : '64px',
      transition: 'width 0.1s ease, opacity 0.5s ease',
    }"
    :collapse="isCollapse"
    active-text-color="rgb(110, 38, 14)"
    background-color="rgb(110, 38, 14,0.5)"
    class="aside-container"
    default-active="active.value"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <p class="logo-lg">{{ isCollapse ? "土豆" : "土豆商店" }}</p>
    <TreeMenu index="1" :menuData="menuData" />
  </el-menu>
</template>
  
  <script setup>
import TreeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { reactive, computed } from "vue";
import { useHeaderStore } from "../stores/index";



const Headerstore = useHeaderStore();
const isCollapse = computed(() => Headerstore.isCollapse);

const router = useRouter();
// const menuData = reactive(router.options.routes[0].children);
const menuData=computed(()=>Headerstore.routerList)
const active=computed(()=>Headerstore.menuActive)
console.log(active)
const handleOpen = () => {};
const handleClose = () => {};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
 

  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
    margin-top: 10px;
  }
}
</style>