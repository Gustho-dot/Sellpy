import React, { useState } from "react";
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
  addTodoToList,
  deleteTodo,
  toggleTodoCompletion,
}) => {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = async (event, id) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const text = newTodoText.trim();
      if (text !== "") {
          await addTodoToList(id, text);
          setNewTodoText("");
      }
    }
  };

  return (
    <Card sx={{ margin: "0 1rem" }}>
      <CardContent>
        <Typography component="h2">{todoList.title}</Typography>
        <form style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {todoList.todos?.map((todo, index) => (
            <div key={todo.id} style={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ margin: "8px" }} variant="h6">
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: "1rem" }}
                label="What to do?"
                value={todo.text}
                disabled={true}
              />
              <Button
                sx={{ margin: "8px" }}
                size="small"
                color="secondary"
                onClick={() => deleteTodo(todoList.id, todo.id)}
              >
                <DeleteIcon />
              </Button>
              <Checkbox
                checked={!!todo.completed}
                onChange={() => toggleTodoCompletion(todoList.id, todo.id, !todo.completed)}
              >
                <CheckIcon />
              </Checkbox>
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ margin: "8px" }} variant="h6">
              {(todoList.todos?.length || 0) + 1}
            </Typography>
            <TextField
              sx={{ flexGrow: 1, marginTop: "1rem" }}
              label="Add new todo"
              placeholder="Press enter to add todo."
              value={newTodoText}
              onChange={(event) => setNewTodoText(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleAddTodo(event, todoList.id)}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};