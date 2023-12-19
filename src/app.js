import { createSSRApp } from 'vue'
import { store } from './store.js'

export function createApp(initValue) {
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
    mounted() {
      this.$store.dispatch('fetch')
    },
    created() {
      this.$store.commit('set', initValue)
    },
    template: `<button @click="increment">{{ count }}</button>`
  })

  app.use(store)

  return app
}
