<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="collapseMenu"><Fold /></el-icon>

      <ul class="flex-box">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{selected:route.path===item.path}"
          class="tab flex-box"
        >
          <el-icon size="12"
            ><component :is="item.icon"
          /></el-icon>
          <router-link class="text flex-box" :to="{path:item.path}">
            {{ item.name }}
        </router-link>
          
          <el-icon  size="12" @click="deleteSelect(item,index)"><Close class="close"/></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar
            :src="userInfo.avatar"
          ></el-avatar>
          <p class="username">{{userInfo.name}}</p>
        </div>
        <template #dropdown>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useHeaderStore } from "../stores/index";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
//拿到当前的路由对象
const route=useRoute()
const router=useRouter()
const Headerstore = useHeaderStore();
const collapseMenu = () => {
  Headerstore.collapseMenu();
};
const selectMenu = computed(() => Headerstore.selectMenu);

const deleteSelect = (item,index) => {
  Headerstore.deleteMenu(index);
  if(route.path!==item.path){
    return 
  }
  const selectMenuData=selectMenu.value
  if(index===selectMenuData.length){
    if(!selectMenuData.length){
        router.push('/')
    }else{
        router.push({
            path:selectMenuData[index-1].path
        })
    }
  }else{
    router.push({
        path:selectMenuData[index].path
    })
  }
};

const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))

const handleClick=(command)=>{
  if(command==="cancel"){
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')

    window.location.href=window.location.origin
  }
}
// console.log(Headerstore)
</script>

<style lang="less">
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
  }
  .header-right {
    .username {
      margin-left: 10px;
    }
  }
  a{
    height: 100%;
    color: rgb(110, 38, 14);
    font-size: 14px;
  }
  .icon{
    color: rgb(110, 38, 14);
  }
}
.tab{
    padding: 0 10px;
    height: 100%;
    .close{
        visibility: hidden;
    }
    .text{
    margin: 0 5px;
    
}
}
.tab:hover{
        background-color: #f5f5f5;
        .close{
        visibility: inherit;
        cursor: pointer;
        color: #000;
    }
    }
    .selected{
        a{
            color:#bd5b00;
        }
        i{
            color:#bd5b00;
        }
        background-color: #f5f5f5;
    }
</style>