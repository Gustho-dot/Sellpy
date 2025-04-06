import {
  getTodoLists,
  addTodoList,
  updateTodoList,
  deleteTodoList,
  getTodosByListId,
  addTodoToList,
  updateTodo,
  deleteTodo,
} from "../models/todoModel.js";
import { validateTodoInput } from "../validations/validate-todo.js";

const sendErrorResponse = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({
    error: error.message || 'An unknown error occurred'
  });
};

export const getAllTodoLists = async (req, res) => {
  try {
    const todoLists = await getTodoLists();
    res.json(todoLists);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const getTodoListById = async (req, res) => {
  const { id } = req.params;
  try {
    const todoLists = await getTodoLists();
    const list = todoLists.find((list) => list.id === parseInt(id));
    
    if (!list) {
      return sendErrorResponse(res, new Error("Todo list not found"), 404);
    }
    
    res.json(list);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const createTodoList = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return sendErrorResponse(res, new Error("Title is required"), 400);
  }
  try {
    const newList = await addTodoList(title);
    res.status(201).json(newList);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const modifyTodoList = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedList = await updateTodoList(id, title);
    
    // Get todos for this list
    const todos = await getTodosByListId(id);
    updatedList.todos = todos;
    
    res.json(updatedList);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const removeTodoList = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteTodoList(id);
    res.json(result);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const getAllTodosForList = async (req, res) => {
  const { id } = req.params;
  try {
    const todos = await getTodosByListId(id);
    res.json(todos);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const createTodoForList = async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  validateTodoInput(text, completed);

  try {
    const newTodo = await addTodoToList(id, text);
    //TODO:  Return full updated list instead.
    res.status(201).json(newTodo);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const modifyTodoForList = async (req, res) => {
  const { todoId } = req.params;
  const { text, completed } = req.body;
  try {
    const updatedTodo = await updateTodo(todoId, text, completed);
    res.json(updatedTodo);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const removeTodoForList = async (req, res) => {
  const { todoId } = req.params;
  try {
    const result = await deleteTodo(todoId);
    res.json(result);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};