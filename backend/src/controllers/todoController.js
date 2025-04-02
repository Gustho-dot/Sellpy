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
  

  // TODO: return actual result instead of bad json from testing. 
  // Clean up structure. This is messy.
  export const getAllTodoLists = async (req, res) => {
    try {
      const todoLists = await getTodoLists();
      res.json(todoLists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getTodoListById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const todoList = await getTodoLists();
      const list = todoList.find((list) => list.id === parseInt(id));
      if (!list) {
        return res.status(404).json({ error: "Todo list not found" });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const createTodoList = async (req, res) => {
    const { title } = req.body;
  
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
  
    try {
      const result = await addTodoList(title);
      const newList = { id: result.lastID, title, todos: [] };
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const modifyTodoList = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
  
    try {
      await updateTodoList(id, title);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const removeTodoList = async (req, res) => {
    const { id } = req.params;
  
    try {
      await deleteTodoList(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getAllTodosForList = async (req, res) => {
    const { id } = req.params;
  
    try {
      const todos = await getTodosByListId(id);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const createTodoForList = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
  
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
   
  
    try {
      await addTodoToList(id, text);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const modifyTodoForList = async (req, res) => {
    const { todoId } = req.params;
    const { text, completed } = req.body;

    // validate correct listId
  
    try {
      await updateTodo(todoId, text, completed);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const removeTodoForList = async (req, res) => {
    const { todoId } = req.params;
  
    // validate list

    try {
      await deleteTodo(todoId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };