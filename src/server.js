import express from 'express'
import sqlite3 from 'sqlite3'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './app.js'

const db = new sqlite3.Database(':memory:')
db.serialize(() => {
  db.run("CREATE TABLE count (value INTEGER)");
  db.run("INSERT INTO count (value) VALUES (0)");
})

const server = express()

server.use(express.static('./src/'))

server.get('/api/v1/count', (req, res) => {
  db.get("SELECT value FROM count", [], (err, row) => {
    res.json({ count: row.value });
  })
})

server.post('/api/v1/count/increment', (req, res) => {
  db.run("UPDATE count SET value = value + 1", [], function (err) {
    res.json({});
  })
})


server.get('/', (req, res) => {
  const { app, store } = createApp()
  renderToString(app).then(html => {
    const state = JSON.stringify(store.state);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vue SSR Example</title>
          <script type="importmap">
            {
              "imports": {
                "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
                "vuex": "https://unpkg.com/vuex@4/dist/vuex.esm-browser.js",
                "@vue/devtools-api": "https://unpkg.com/@vue/devtools-api@6.2.1/lib/esm/index.js",
                "axios": "https://unpkg.com/axios@1.6.2/dist/esm/axios.min.js"
              }
            }
          </script>
          <script type="module" src="/client.js"></script>
          <script>
            window.__INITIAL_STATE__ = ${state}
          </script>
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>
    `)
  })
})

server.listen(3000)