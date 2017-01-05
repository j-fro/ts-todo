import express = require('express');
import bodyParser = require('body-parser');
import path = require('path');
import pg = require('pg');
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 8000
const connString = 'postgres://localhost:5432/todos'

class Task {
    constructor(private id: number, public name: string, public complete: boolean) {}
}

let tasks = Array<Task>();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});

app.get('/getTasks', (req, res) => {
    queryTasks().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
})

app.post('/addTask', (req, res) => {
    console.log('Adding task:', req.body);
    pg.connect(connString, (err, client, done) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO todos (name) VALUES ($1)', [req.body.name]).then(() => {
                queryTasks().then((result) => {
                    res.send(result);
                }).catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
        }
    })
});

app.listen(port, () => {
    console.log("Server listening on", port);
});

app.use(express.static('built/public'));

function queryTasks(): Promise<Array<Task>> {
    return new Promise((resolve, reject) => {
        pg.connect(connString, (err, client, done) => {
            if(err) {
                console.log(err);
                reject(err);
            } else {
                client.query('SELECT * FROM todos').then((result) => {
                    tasks = result.rows.reduce((tasks, row) => {
                        tasks.push(new Task(row.id, row.name, row.complete));
                        return tasks
                    }, Array<Task>());
                    resolve(tasks);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
}