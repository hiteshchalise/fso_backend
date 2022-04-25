const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errors');
const dotenv = require('dotenv');
dotenv.config();

const Phonebook = require('./models/phonebook');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());


morgan.token('body', function getId(req) {
    if (req.method === "POST") return JSON.stringify(req.body);
    return '';
})

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req)
    ].join(' ')
}));

const date = new Date();
app.get('/info', (req, res, next) => {
    Phonebook.countDocuments({})
        .then(result => {
            res.send(`<div>
                    Phonebook has info for ${result} people
                    <br><br>
                    ${date}
                </div>`);
        }).catch(error => next(error));
})

app.get('/api/persons', (req, res, next) => {
    Phonebook.find({}).then(result => res.json(result)).catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    Phonebook
        .findById(req.params.id)
        .then(person => {
            if (!person) {
                res.status(404).json({ message: `No person of id ${req.params.id} found.` });
            } else {
                res.json(person);
            }
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    if (!req.body.name) return res.status(400).json({ error: 'Name is missing' });
    if (!req.body.number) return res.status(400).json({ error: 'Number is missing' });

    const phonebook = new Phonebook({
        name: req.body.name,
        number: req.body.number
    });

    phonebook.save()
        .then(savedPhonebook => {
            res.status(201).json(savedPhonebook);
        })
        .catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Phonebook
        .findOneAndRemove({ _id: id })
        .then(entry => {
            if (!entry) res.status(404).json({ error: `No person of id ${id} found.` });
            res.status(204).end();
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// This middleware has to be the last to be loaded.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})