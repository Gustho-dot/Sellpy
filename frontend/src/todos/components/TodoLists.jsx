import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  TextField,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'
import useTodos from '../../hooks/useTodos'
import DeleteIcon from "@mui/icons-material/Delete";

export const TodoLists = ({ style }) => {
  const [activeList, setActiveList] = useState(null);
  const [newListTitle, setNewListTitle] = useState('')

  const {
    todoLists,
    error,
    saveTodoList,
    addTodoToList,
    toggleTodoCompletion,
    deleteTodo,
    addNewTodoList,
    deleteTodoList,
  } = useTodos();

  useEffect(() => {
    if (activeList) {
      const updated = todoLists.find((list) => list.id === activeList.id);
      if (updated) {
        setActiveList(updated);
      }
    }
  }, [todoLists, activeList]);


  const handleAddList = (rawTitle) => {
    const title = rawTitle?.trim();
    if (title) {
      addNewTodoList(title)
      setNewListTitle('')
    }
  }

  if (error) {
    return <Typography>Error loading lists: {error}</Typography>
  } 

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component="h2">My Todo Lists</Typography>
          <List>
            {todoLists.map((list) => (
              <div key={list.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
                <ListItemButton
                  selected={list.id === activeList?.id}
                  onClick={() => setActiveList(list)}
                  style={{ flexGrow: 3}}
                >
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={list.title} />
                </ListItemButton>
                <ListItemButton 
                onClick={() => deleteTodoList(list.id)}
                >
                  <DeleteIcon />
                </ListItemButton>
              </div>
            ))}
          </List>
        </CardContent>
        <CardContent>
          <TextField
            label="New List Title"
            value={newListTitle}
            onChange={(event) => setNewListTitle(event.target.value)}
            fullWidth
          />
          <Button
            onClick={() => handleAddList(newListTitle)}
            color="primary"
            variant="contained"
            sx={{ marginTop: '0.5rem' }}
          >
            Add New List
          </Button>
        </CardContent>
      </Card>
      {activeList && (
        <TodoListForm
          todoList={activeList}
          saveTodoList={saveTodoList}
          addTodoToList={addTodoToList}
          deleteTodo={deleteTodo}
          toggleTodoCompletion={toggleTodoCompletion}
        />
      )}
    </Fragment>
  )
}