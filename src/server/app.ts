import express = require('express');
import bodyParser = require('body-parser');
import path = require('path');
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = 8000

class Task {
    constructor(private id: number, public name: string, public complete: boolean) {}
}

let tasks = Array<Task>();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});

app.get('/getTasks', (req, res) => {
    res.send(tasks);
})

app.post('/addTask', (req, res) => {
    console.log('Adding task:', req.body);
    tasks.push(new Task(0, req.body.name, false));
    res.send(tasks);
});

app.listen(port, () => {
    console.log("Server listening on", port);
});

app.use(express.static('built/public'));