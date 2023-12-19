import express from 'express'
import session from 'express-session'
import sqlite3 from 'sqlite3'
import util from 'util'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './app.js'
import { store } from './store.js'

const db = new sqlite3.Database(':memory:')
db.serialize(() => {
  db.run("CREATE TABLE count (id TEXT, value INTEGER)");
})

const server = express()

server.use(express.static('./src/'))
server.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

server.get('/api/v1/count', (req, res) => {
  db.get("SELECT id, value FROM count WHERE id = ?", [req.sessionID], (err, row) => {
    res.json({ count: row.value })
  })
})

server.post('/api/v1/count/increment', (req, res) => {
  db.run("UPDATE count SET value = value + 1 WHERE id = ?", [req.sessionID], err => {
    res.json({})
  })
})

server.get('/', async (req, res) => {
  if (!req.session.hasVisited) {
    await db.run("INSERT INTO count (id, value) VALUES (?, 0)", [req.sessionID])
    req.session.hasVisited = true
  }

  let initValue = (await util.promisify(db.get).bind(db)(
    "SELECT id, value FROM count WHERE id = ?", [req.sessionID])).value

  const app = createApp(initValue)
  renderToString(app).then(html => {
    const state = JSON.stringify(store.state);
    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Counter</title>
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

server.get('/leak', async (req, res) => {
  const state = JSON.stringify(store.state)
  res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Counter Leak</title>
            <script>
              window.__INITIAL_STATE__ = ${state}
            </script>
          </head>
          <body>
            state is ${state}
          </body>
        </html>
  `)
})

server.listen(3000)