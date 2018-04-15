const mongoose = require('mongoose');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

mongoose
  .connect(process.env.MONGODB_URI)
  .catch(err => console.log(err));

const Person = mongoose.model('Person', {
  name: String,
  number: String,
}, 'Persons');

const name = process.argv[2];
const number = process.argv[3];

if (name === undefined) {
  Person
    .find({})
    .then((res) => {
      res.forEach(p => console.log(p.name, p.number));
      mongoose.disconnect();
    });
} else {
  const person = new Person({ name, number });
  person
    .save()
    .then(() => {
      console.log('Lisätään henkilö', name, 'numero', number, 'luetteloon');
      mongoose.disconnect();
    });
}
