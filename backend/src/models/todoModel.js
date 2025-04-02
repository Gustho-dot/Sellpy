import { initDB } from "../db/db.js";
import {validateTodoInput} from "../validations/validate-todo.js"

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
      console.log(error);
      throw error;
    }
  };

export const getTodos = async () => {
    const db = await initDB();
    return db.all("SELECT * FROM todos ORDER BY created_at DESC");
  };

export const getTodosByListId = async (listId) => {
    const db = await initDB();
    return await db.all("SELECT * FROM todos WHERE list_id = ? ORDER BY created_at DESC", [listId]);
};

export const addTodoList = async (title) => {
    try {
      if (typeof title !== "string" || title.trim() === "") {
        throw new Error("Invalid todo list title");
      }
  
      const db = await initDB();
      const result = await db.run(
        "INSERT INTO todo_lists (title) VALUES (?)",
        [title]
      );
  
      return result;
    } catch (error) {
      throw new Error(`Failed to add todo list: ${error.message}`);
    }
  };
  
  export const updateTodoList = async (id, title) => {
    try {
      if (typeof title !== "string" || title.trim() === "") {
        throw new Error("Invalid todo list title");
      }
  
      const db = await initDB();
      const result = await db.run(
        "UPDATE todo_lists SET title = ? WHERE id = ?",
        [title, id]
      );
  
      return result;
    } catch (error) {
      throw new Error(`Failed to update todo list: ${error.message}`);
    }
  };
  
  export const deleteTodoList = async (id) => {
    try {
      const db = await initDB();
  
      // delete associated todos. 
      await db.run("DELETE FROM todos WHERE list_id = ?", [id]);
      // TODO: use promise.all/allSettled or transaction/prepare?
      const result = await db.run("DELETE FROM todo_lists WHERE id = ?", [id]);
  
      return result;
    } catch (error) {
      throw new Error(`Failed to delete todo list: ${error.message}`);
    }
  };

export const addTodoToList = async (list_id, text) => {
  try {
    //validateTodoInput({ text });

    const db = await initDB();
    const result = await db.run(
      "INSERT INTO todos (text, completed, list_id) VALUES (?, ?, ?)",
      [text, 0, list_id]
    );

    return result;
  } catch (error) {
    throw new Error(`Failed to add todo: ${error.message}`);
  }
};

export const updateTodo = async (id, text, completed) => {
  try {
   
    // TODO: remvoe this hack and create another route or make sure 
    // DB can take undefined === not change.
    if (!text && completed !== undefined) {
        await toggleTodoCompletion(id, completed);
        return;
    }

    validateTodoInput({ id, text, completed });

    const db = await initDB();
    const result = await db.run(
      "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
      [text, completed ? 1 : 0, id]
    );

    return result;
  } catch (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }
};

export const toggleTodoCompletion = async (id, completed) => {
  try {
    const db = await initDB();
    const result = await db.run(
      "UPDATE todos SET completed = ? WHERE id = ?",
      [completed ? 1 : 0, id]
    );

    return result;
  } catch (error) {
    throw new Error(`Failed to toggle todo completion: ${error.message}`);
  }
};

export const deleteTodo = async (id) => {
  try {
    const db = await initDB();
    const result = await db.run("DELETE FROM todos WHERE id = ?", [id]);  // Delete the todo by its ID
    return result;
  } catch (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
};
