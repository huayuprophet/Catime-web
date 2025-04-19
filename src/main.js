// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
// 使用持久化插件
pinia.use(piniaPluginPersistedstate)
// 挂载 Pinia
app.use(pinia)
// 挂载应用
app.mount('#app')

