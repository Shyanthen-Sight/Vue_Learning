import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import person from'./components/person.vue'

const app = createApp(App)

//全局注册person组件
app.component('person', person)
//  createApp(App).component('person', person).mount('#app')

app.mount('#app')