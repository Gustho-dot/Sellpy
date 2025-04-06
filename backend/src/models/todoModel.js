import { initDB } from "../db/db.js";
import { validateTodoInput } from "../validations/validate-todo.js";

// TODOS: 
// - Dataloaders for batching? 
// - Redis for caching
// - groupBy and mapping structure. 
// - Zod for validation
// - Auth middleWare.
// - Validate send better structured message back, with ID. 
// - better SQL (joins etc)
// - not run initDB constantly (DRY)
export const getTodoLists = async () => {
  const db = await initDB();
  
  try {
    const todoLists = await db.all("SELECT * FROM todo_lists ORDER BY created_at DESC");
    
    for (let list of todoLists) {
      const todos = await db.all("SELECT * FROM todos WHERE list_id = ? ORDER BY created_at DESC", [list.id]);
      list.todos = todos;
    }
    
    return todoLists;
  } catch (error) {
    console.error("Error getting todo lists:", error);
    throw error;
  }
};

export const getTodosByListId = async (listId) => {
  const db = await initDB();
  return await db.all("SELECT * FROM todos WHERE list_id = ? ORDER BY created_at DESC", [listId]);
};

export const addTodoList = async (title) => {
  try {

    const db = await initDB();
    const result = await db.run(
      "INSERT INTO todo_lists (title) VALUES (?)",
      [title]
    );

    return {
      id: result.lastID,
      title: title,
      todos: [],
      created_at: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to add todo list: ${error.message}`);
  }
};

export const updateTodoList = async (id, title) => {
  try {
    validateTodoInput(title);

    const db = await initDB();
    await db.run(
      "UPDATE todo_lists SET title = ? WHERE id = ?",
      [title, id]
    );

    const updated = await db.get("SELECT * FROM todo_lists WHERE id = ?", [id]);
    if (!updated) {
      throw new Error("Todo list not found");
    }
    
    return updated;
  } catch (error) {
    throw new Error(`Failed to update todo list: ${error.message}`);
  }
};

export const deleteTodoList = async (id) => {
  try {
    const db = await initDB();

    await db.run("DELETE FROM todos WHERE list_id = ?", [id]);
    await db.run("DELETE FROM todo_lists WHERE id = ?", [id]);

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete todo list: ${error.message}`);
  }
};

export const addTodoToList = async (list_id, text) => {
  try {
    const db = await initDB();
    
    const list = await db.get("SELECT id FROM todo_lists WHERE id = ?", [list_id]);

    if (!list) {
      throw new Error("Todo list not found");
    }

    const response = await db.run(
      "INSERT INTO todos (text, completed, list_id) VALUES (?, ?, ?)",
      [text, 0, list_id]
    );

    const result = await db.get("SELECT * FROM todos WHERE id = ?", [response.lastID]);

    return result;
  } catch (error) {
    throw new Error(`Failed to add todo: ${error.message}`);
  }
};

export const updateTodo = async (id, text, completed) => {
  try {
    if (text === undefined && completed !== undefined) {
      return await toggleTodoCompletion(id, completed);
    }

    validateTodoInput(text, completed );

    const db = await initDB();
    await db.run(
      "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
      [text, completed ? 1 : 0, id]
    );

    const updatedTodo = await db.get("SELECT * FROM todos WHERE id = ?", [id]);
    if (!updatedTodo) {
      throw new Error("Todo not found");
    }
    
    return updatedTodo;
  } catch (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }
};

export const toggleTodoCompletion = async (id, completed) => {
  try {
    const db = await initDB();
    await db.run(
      "UPDATE todos SET completed = ? WHERE id = ?",
      [completed ? 1 : 0, id]
    );

    const updatedTodo = await db.get("SELECT * FROM todos WHERE id = ?", [id]);
    if (!updatedTodo) {
      throw new Error("Todo not found");
    }
    
    return updatedTodo;
  } catch (error) {
    throw new Error(`Failed to toggle todo completion: ${error.message}`);
  }
};

export const deleteTodo = async (id) => {
  try {
    const db = await initDB();
    await db.run("DELETE FROM todos WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
};
