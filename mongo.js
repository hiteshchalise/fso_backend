const mongoose = require('mongoose');

console.log(process.argv);

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://hiteshchalise:${password}@cluster0.nxset.mongodb.net/phonebook_app?retryWrites=true&w=majority`;

mongoose.connect(url);


const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Phonebook = mongoose.model('Phonebook', phonebookSchema);

if (!process.argv[3]) {
    Phonebook.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(entry => console.log(`${entry.name} ${entry.number}`));
        mongoose.connection.close();
    });
} else {
    const newPhonebook = new Phonebook({
        name: process.argv[3],
        number: process.argv[4]
    });

    newPhonebook.save().then(() => {
        console.log(`added ${newPhonebook.name} number ${newPhonebook.number} to phonebook`);
        mongoose.connection.close();
    });
}