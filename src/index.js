const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({error: "Caiu aqui"})
  } 

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usersAlradyExists = users.some((user) => user.username === username)

  if (usersAlradyExists) {
    return response.status(400).json({error: "Usuário já existe!"})
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  });

  console.log(users)
  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  console.log(user)
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;