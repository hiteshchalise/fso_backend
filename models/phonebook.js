const mongoose = require('mongoose');
const url = process.env.MONGODB_URL;

mongoose.connect(url)
    .then(_ => { console.log('connected to MongoDB') })
    .catch((error) => { console.log('error connecting to MongoDB:', error.message) })

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

module.exports = Phonebook;
