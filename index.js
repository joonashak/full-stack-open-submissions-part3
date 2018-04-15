const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

// Middleware
app.use(bodyParser.json());
morgan.token('type', req => JSON.stringify(req.body));
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'));

// Frontend
app.use(express.static('build'));

// Routes
app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(p => res.json(p.map(Person.format)));
});

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  Person
    .findById(id)
    .then(p => res.send(Person.format(p)))
    .catch(() => res.status(404).send());
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  // Data validation
  if (name === undefined || name === '') return res.status(400).send({ error: 'Missing name' });
  if (number === undefined || number === '') return res.status(400).send({ error: 'Missing phone number' });

  const person = new Person({ name, number });
  person
    .save()
    .then((p) => {
      res.status(201).json(Person.format(p));
    })
    .catch((err) => {
      err.code === 11000 ? res.status(409).send() : res.status(400).send();
    });
});

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;

  Person
    .updateOne({ _id: req.params.id }, { name, number })
    .then((p) => {
      Person.findById(req.params.id).then(p => res.send(p));
    });
});

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => console.log(err));
});

app.get('/info', (req, res) => {
  Person
    .count({})
    .then((c) => {
      res.send(`
      <p>Puhelinluettelossa ${c} henkilön tiedot</p>
      <p>${new Date()}</p>
  `);
    });
});

app.listen(process.env.PORT || 3001);
