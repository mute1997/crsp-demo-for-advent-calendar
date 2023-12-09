import { createApp } from './app.js'

const { app, store } = createApp()
store.replaceState(window.__INITIAL_STATE__)
app.mount('#app')
