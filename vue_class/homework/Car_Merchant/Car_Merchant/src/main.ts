import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 字体：官方 kit 自带的 @font-face（含 woff2/woff/ttf 三种格式和 font-display: swap）
import './assets/fonts/Bebas Neue/Fonts/WEB/css/bebas-neue.css'
import './assets/fonts/Nunito/Fonts/WEB/css/nunito.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
