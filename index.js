const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }]

const generateId = () => {
    return Date.now();
}


const date = new Date();
app.get('/info', (req, res) => {
    res.send(`<div>
        Phonebook has info for ${persons.length} people
        <br><br>
        ${date}
    </div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === Number.parseInt(req.params.id));
    if (!person) {
        return res.status(404).json({
            message: `No person of id ${req.params.id} found.`
        });
    }
    res.json(person);
});

app.post('/api/persons', (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: 'Name is missing' });
    if (!req.body.number) return res.status(400).json({ error: 'Number is missing' });
    if (persons.find(person => person.name === req.body.name)) return res.status(400).json({ error: 'Name already exists' });
    const person = {
        id: generateId(),
        name: req.body.name,
        number: req.body.number
    }

    persons = persons.concat(person);
    res.status(201).json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const index = persons.findIndex(person => person.id === id);

    if (index < 0) res.status(404).json({ error: `No person of id ${id} found.` });

    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})