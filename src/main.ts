import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import App from './App.vue'
import formKitConfig from '../formkit.config'
import "./tailwind.css"
const app = createApp(App)
app.use(plugin, defaultConfig(formKitConfig))
app.mount('#app')
