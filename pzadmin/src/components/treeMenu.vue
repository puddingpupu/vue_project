<template>
  
 
  <!-- `${props.index}-${item.meta.id}` 目的是为了外层index加内层id以确定组件唯一性-->
<template  v-for="(item, index) in props.menuData">
   <el-menu-item 
   @click="handleClick(item,`${props.index}-${item.meta.id}`)"
    v-if="!item.children||item.children.length==0" 
    :index="`${props.index}-${item.meta.id}`"
    :key="`${props.index}-${item.meta.id}`">
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu  v-else :index="`${props.index}-${item.meta.id}`" :key="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
        <span>{{item.meta.name}}</span>
      </template>
      <TreeMenu :index="`${props.index}-${item.meta.id}`" :menuData="item.children"/>
    </el-sub-menu>
</template>
   
</template>


<script  setup>
import {useRouter} from 'vue-router'
import { useHeaderStore } from "../stores/index";

const props = defineProps(["menuData","index"]);

//创建router实例
const router=useRouter()

const addStore=useHeaderStore()
//点击菜单
const handleClick=(item,active)=>{
  addStore.addMenu(item.meta)
  addStore.updateMenuActive(active)
  router.push(item.meta.path)
}
</script>

<style>
</style>