import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  CardContent,
  Button,
  Typography,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

export const TodoListForm = ({
  todoList,
  todos: existingTodos,
  addTodoToList,
  deleteTodo,
  toggleTodoCompletion,
}) => {
  const [todos, setTodos] = useState([...(existingTodos || [])]);
  

  useEffect(() => {
    if (todos.length === 0 || todos.at(-1)?.text) {
      setTodos([...todos, { text: "", completed: false }]);
    }
  }, [todos]);
 
  // add some debounce for saving?
  // save on blur, with optimistic response?
  const handleOnChange = (event, index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].text = event.target.value;
    setTodos(updatedTodos);
  };
  
  const handleOnBlur = (event, id) => {
    const text = event.target.value.trim();
    
    // Only add if there is text
    if (text !== "") {
      addTodoToList(id, text);
    }
  };
  
  const handleKeyDown = (event, index, id) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      const text = event.target.value.trim();
      if (text !== "") {
        addTodoToList(id, text);
      }
    }
  };
  
  return (
    <Card sx={{ margin: "0 1rem" }}>
      <CardContent>
        <Typography component="h2">{todoList.title}</Typography>
        <form
          style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          {todos?.map((todo, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ margin: "8px" }} variant="h6">
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: "1rem" }}
                label="What to do?"
                value={todo.text}
                onChange={(event) => handleOnChange(event, index)}
                onBlur={(event) => handleOnBlur(event, todoList.id)}
                onKeyDown={(event) => handleKeyDown(event, index, todoList.id)}
              />
              {todo?.text?.trim() !== "" && todo.id && (
                <Button
                  sx={{ margin: "8px" }}
                  size="small"
                  color="secondary"
                  onClick={() => deleteTodo(todoList.id, todo.id)}
                >
                  <DeleteIcon />
                </Button>
              )}
              {todo.id && (
                <Checkbox
                  onClick={async () =>
                    toggleTodoCompletion(todoList.id, todo.id, !todo.completed)
                  }
                >
                  <CheckIcon />
                </Checkbox>
              )}
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  );
};