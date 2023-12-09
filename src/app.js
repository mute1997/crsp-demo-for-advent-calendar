import { createSSRApp } from 'vue'
import { createVuexStore } from './store.js'

const store = createVuexStore()

export function createApp() {
  const app = createSSRApp({
    computed: {
      count() {
        return this.$store.state.count
      }
    },
    methods: {
      increment() {
        this.$store.dispatch('increment')
      }
    },
    created() {
      this.$store.dispatch('fetch')
    },
    template: `<button @click="increment">{{ count }}</button>`
  })

  app.use(store)

  return { app, store }
}
