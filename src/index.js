const express = require("express");

const { v4: uuid } = require("uuid");

function checksExistsUserAccount(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checksExistsUserAccount, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  console.log(repository);
  console.log(updatedRepository);

  if('likes' in updatedRepository) {
    delete updatedRepository.likes;
  }

  const newRepository = { ...repository, ...updatedRepository };

  console.log(newRepository);

  return response.json(newRepository);
});

app.delete("/repositories/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.repository;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsUserAccount, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
