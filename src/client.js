import { createApp } from './app.js'

const app = createApp(window.__INITIAL_STATE__.count)
app.mount('#app')
