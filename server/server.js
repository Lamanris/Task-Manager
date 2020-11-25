import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import shortid from 'shortid'
import fs from 'fs'

import cookieParser from 'cookie-parser'
import config from './config'
import Html from '../client/html'

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()
const { readFile, writeFile, unlink } = require('fs').promises

const wFile = async (tasks, category) => {
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(tasks), {
    encoding: 'utf8'
  })
}

const rFile = (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((res) => JSON.parse(res))
    .catch(() => [])
}

const delFile = (taskList, category) => {
  return unlink(`${__dirname}/tasks/${category}.json`)
}

const filteredKey = (tasks) => {
  return tasks.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const taskList = filteredKey(await rFile(category))
  res.json(taskList)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const timePeriod = {
    minute: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    week: 7 * 1000 * 60 * 60 * 24,
    month: 30 * 1000 * 60 * 60 * 24
  }
  const tasks = await rFile(category)
  const filteredTasks = filteredKey(
    // eslint-disable-next-line no-underscore-dangle
    tasks.filter((el) => el._createdAt + timePeriod[timespan] > +new Date())
  )
  res.json(filteredTasks)
})

server.get('/api/v1/categories', (req, res) => {
  const files = fs.readdirSync(`${__dirname}/tasks`)
  res.send(files.map((el) => el.replace('.json', '')))
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  if (req.body.title) {
    const { category } = req.params
    const newTask = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const tasks = await rFile(category)
    const addTask = [...tasks, newTask]
    await wFile(addTask, category)
    res.json('Task added')
  } else if (req.body.name) {
    await wFile('', req.body.name)
    res.json('New category added')
  }
})

server.patch('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const taskList = await rFile(category)
  const newCategoryName = category.replace(category, req.body.categoryChangedName)
  await delFile(taskList, category)
  await wFile(taskList, newCategoryName)
  console.log(category)
  console.log(newCategoryName)
  res.json('Name was changed')
})
server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  if (req.body.status) {
    const status = ['done', 'new', 'in progress', 'blocked']
    if (status.includes(req.body.status)) {
      const taskList = await rFile(category)
      const updatedStatus = taskList.map((task) =>
        task.taskId === id ? { ...task, ...req.body } : task
      )
      await wFile(updatedStatus, category)
      res.json({ status: `${req.body.status}`, message: 'status updated' })
    } else {
      res.status(501)
      res.json({ status: 'error', message: 'incorrect status' })
    }
  } else if (req.body.title) {
    const taskList = await rFile(category)
    const updatedTitle = taskList.map((task) =>
      task.taskId === id ? { ...task, ...req.body } : task
    )
    await wFile(updatedTitle, category)
    res.json({ title: `${req.body.title}`, message: 'title updated' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const taskList = await rFile(category)
  const deletedTask = taskList.map((task) =>
    task.taskId === id ? { ...task, _isDeleted: true } : task
  )
  await wFile(deletedTask, category)
  res.json('Succesfully deleted')
})

server.delete('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const taskList = await rFile(category)
  await delFile(taskList, category)
  res.json('File was deleted')
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Boilerplate'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
