const DATA = require('./data.json')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

// Middleware
app.use(bodyParser.json())
morgan.token('type', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

// Frontend
app.use(express.static('build'))

// Routes
app.get('/api/persons', (req, res) => {
  res.json(DATA.persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const ids = DATA.persons.map(p => p.id)

  if (!ids.includes(id)) return res.status(404).end()

  res.json(DATA.persons.find(p => p.id === id))
})

app.post('/api/persons', (req, res) => {
  const name = req.body.name
  const number = req.body.number
  const id = Math.floor(Math.random() * 1e8)

  // Data validation
  if (name === undefined || name === '') return res.status(400).send({ error: 'Missing name' })
  if (number === undefined || number === '') return res.status(400).send({ error: 'Missing phone number' })

  const names = DATA.persons.map(p => p.name)
  if (names.includes(name)) return res.status(400).send({ error: 'Person already exists' })

  const person = { name, number, id }

  DATA.persons.push(person)
  res.status(201).send(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const ids = DATA.persons.map(p => p.id)

  if (!ids.includes(id)) return res.status(404).end()

  DATA.persons = DATA.persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Puhelinluettelossa ${ DATA.persons.length } henkilön tiedot</p>
    <p>${ new Date() }</p>
  `)
})

app.listen(process.env.PORT || 3001)
