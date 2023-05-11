const { readFileSync, writeFileSync, write } = require("fs");
const express = require("express");
const router = express.Router();
const PATH_TO_DATA = "./data/todos.json";
const { v4: uuidv4 } = require("uuid");
const getTodos = () => {
  return JSON.parse(readFileSync(PATH_TO_DATA));
};

const appendTodo = (todo) => {
  const todos = getTodos();
  todos.push(todo);
  writeFileSync(PATH_TO_DATA, JSON.stringify(todos), { flag: "w" });
};

router.get("/", (req, res) => {
  res.json(getTodos());
});

router.get("/:todoId", (req, res) => {
  const todos = getTodos();
  const todoId = req.params.todoId;
  const result = todos.filter((todo) => todo.id == todoId);
  if (result.length == 0) {
    res.status(404).json("404 - resource not found");
  } else {
    res.json(result);
  }
});

router.post("/", (req, res) => {
  const todos = getTodos();
  const newTodo = {
    id: uuidv4(),
    ...req.body,
  };

  todos.push(newTodo);
  appendTodo(newTodo);
  res.status(201).json(newTodo);
});

router.delete("/:id", (req, res) => {
  const todos = getTodos();
  const todoId = req.params.id;
  const index = todos.findIndex((todo) => todo.id == todoId);

  if (index === -1) {
    res.status(404).json("404 Not Found");
  } else {
    todos.splice(index, 1);
    writeFileSync(PATH_TO_DATA, JSON.stringify(todos), { flag: "w" });
    res.status(204).send();
  }
});

//TODO
router.put("/:todoId", () => {});

module.exports = router;
