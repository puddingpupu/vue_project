import { defineStore } from "pinia";
import { computed, ref } from "vue";


export const useHeaderStore = defineStore('head', {

    state: () => ({
        isCollapse: false,
        selectMenu: [],
        routerList: [],
        menuActive: '1-1'
    }),
    actions: {
        collapseMenu() {
            // console.log(this.isCollapse)
            this.isCollapse = !this.isCollapse
        },
        addMenu(payload) {
            if (this.selectMenu.findIndex(item => item.path === payload.path) === -1) {
                this.selectMenu.push(payload)
            }
        },
        deleteMenu(index) {
            this.selectMenu.splice(index, 1)
        },
        dynamicMenu(payload) {
            //通过glob导入文件
            const modules = import.meta.glob('../views/**/**/*.vue')

            function routerSet(router) {

                //判断没有子菜单，拼接路由数据
                router.forEach(route => {
                    if (!route.children) {
                        const url = `../views${route.meta.path}/index.vue`
                        //拿到获取的vue组件
                        route.component = modules[url]
                    } else {
                        routerSet(route.children)
                    }
                })

            }
            routerSet(payload)
            //拿到完整的路由数据
            this.routerList = payload
            console.log(this.routerList)
        },
        updateMenuActive(state){
            this.menuActive=state
            console.log(this.menuActive)
        }
    },
    persist: {
        enabled: true
    }


})