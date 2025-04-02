import express from "express";
import {
  getAllTodoLists,
  getTodoListById,
  createTodoList,
  modifyTodoList,
  removeTodoList,
  getAllTodosForList,
  createTodoForList,
  modifyTodoForList,
  removeTodoForList,
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/todoLists", getAllTodoLists);
router.get("/todoList/:id", getTodoListById);
router.post("/todoLists", createTodoList);
router.put("/todoLists/:id", modifyTodoList);
router.delete("/todoLists/:id", removeTodoList);

router.get("/todoLists/:id/todos", getAllTodosForList);
router.post("/todoLists/:id/todos", createTodoForList);
router.put("/todoLists/:id/todos/:todoId", modifyTodoForList);
router.delete("/todoLists/:id/todos/:todoId", removeTodoForList);

export { router };