import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import PanelHead from './components/panelHead.vue'

//引入路由守卫
router.beforeEach((to,from)=>{
const token=localStorage.getItem('pz_token')
//非登录页面token不存在
if(!token&&to.path!=='/login'){
return '/login'
}else if(token &&to.path==='/login'){
    return '/'
}else{
    return true
}
})

const pinia = createPinia()
const app=createApp(App)

app.component('PanelHead',PanelHead)

//路由挂载
app.use(router)
app.use(pinia)
app.mount('#app')
pinia.use(piniaPluginPersistedstate)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
