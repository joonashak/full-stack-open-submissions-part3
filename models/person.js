const mongoose = require('mongoose');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

mongoose
  .connect(process.env.MONGODB_URI)
  .catch(err => console.log(err));

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  number: String,
});

// Arrow function doesn't work (see http://mongoosejs.com/docs/guide.html#statics)
schema.statics.format = function (doc) {
  const newDoc = { ...doc._doc, id: doc._id };
  delete newDoc._id;
  delete newDoc.__v;
  return newDoc;
};

const Person = mongoose.model('Person', schema, 'Persons');

module.exports = Person;
