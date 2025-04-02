import { useState, useEffect } from 'react';
import { makeTodoAPIRequest } from '../api/makeRequest.js';

//TODO: Break up this into two custom hooks. This state is messy and is duplicating todos.
const useTodos = () => {
  const [todoLists, setTodoLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        const result = await makeTodoAPIRequest({
          path: 'todoLists',
          method: 'GET',
        });
        setTodoLists(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTodoLists();
  }, []);

  const saveTodoList = async (listId, title) => {
    try {
      await makeTodoAPIRequest({
        path: `todoLists/${listId}`,
        method: 'PUT',
        body: { title },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const addTodoToList = async (listId, text) => {
    try {
      const newTodo = { text, completed: false };
      
      const targetList = todoLists.find((list) => list.id === listId);
      
      if (!targetList) {
        throw new Error(`Todo list with id ${listId} not found`);
      }
      
      const currentTodos = [...(targetList.todos || [])];
      
      const addedTodo = await makeTodoAPIRequest({
        path: `todoLists/${listId}/todos`,
        method: 'POST',
        body: newTodo,
      });
      
      // make this reusable
      setTodoLists((prev) =>
        prev.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              todos: [...currentTodos, addedTodo || newTodo]
            };
          }
          return list;
        })
      );
    } catch (err) {
      console.error("Error adding todo:", err);
      setError(err.message);
    }
  };

  const toggleTodoCompletion = async (listId, todoId, completed) => {
    try {
      await makeTodoAPIRequest({
        path: `todoLists/${listId}/todos/${todoId}`,
        method: 'PUT',
        body: { completed, id: todoId },
      });
      //make this into helper function
      setTodoLists((prev) => {
        return prev.map((list) => {
          if (list.id === listId) {
            const updatedTodos = list.todos.map((todo) =>
              todo.id === todoId ? { ...todo, completed } : todo
            );
            return { ...list, todos: updatedTodos };
          }
          return list;
        });
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (listId, todoId) => {
    try {
      await makeTodoAPIRequest({
        path: `todoLists/${listId}/todos/${todoId}`,
        method: 'DELETE',
      });

      // fix this so instant update
      setTodoLists((prev) => {
        return prev.map((list) => {
          if (list.id === listId) {
            const updatedTodos = list.todos.filter((todo) => todo.id !== todoId);
            return { ...list, todos: updatedTodos };
          }
          return list;
        });
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const addNewTodoList = async (title) => {
    try {
      const createdList = await makeTodoAPIRequest({
        path: 'todoLists',
        method: 'POST',
        body: {title: title},
      });
      setTodoLists((prev) => [...prev, createdList]);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    todoLists,
    loading,
    error,
    saveTodoList,
    addTodoToList,
    toggleTodoCompletion,
    deleteTodo,
    addNewTodoList,
  };
};

export default useTodos;