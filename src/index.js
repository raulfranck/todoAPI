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
    return response.status(400).json({error: "Usuário não encontrado"})
  } 

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usersAlradyExists = users.some((user) => user.username === username)

  if (usersAlradyExists) {
    return response.status(400).json({error: "Usuário já foi criado"})
  }
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todoOperation = {
    id: uuidv4(),
	  title,
	  done: false, 
	  deadline: new Date(deadline),
	  created_at: new Date()
  }

  user.todos.push(todoOperation);

  return response.status(201).json(todoOperation)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request;
  const { id } = request.params;

  const todoVerify = user.todos.find(todo => todo.id === id)

  if (!todoVerify) {
    return response.status(404).json({error: "Todo não encontrado"})
  }

  todoVerify.title = title;
  todoVerify.deadline = new Date(deadline);

  return response.status(201).json(user)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoVerify = user.todos.find(todo => todo.id === id)

  if (!todoVerify) {
    return response.status(404).json({error: "Todo não encontrado"})
  }

  todoVerify.done = true;

  return response.status(201).json(user)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

