const mongoose = require('mongoose');
const url = process.env.MONGODB_URL;

mongoose.connect(url)
    .then(() => { console.log('connected to MongoDB'); })
    .catch((error) => { console.log('error connecting to MongoDB:', error.message); });

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function (v) {
                return /(^\d{2}|\d{3})-(\d+$)/gm.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number required']
    }
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

module.exports = Phonebook;
