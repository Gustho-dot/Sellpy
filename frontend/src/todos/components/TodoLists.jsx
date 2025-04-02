import React, { Fragment, useState } from 'react'
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

export const TodoLists = ({ style }) => {
  const [activeList, setActiveList] = useState(null)
  const [newListTitle, setNewListTitle] = useState('')

  const { todoLists, loading, error, saveTodoList, addTodoToList, toggleTodoCompletion, deleteTodo, addNewTodoList } = useTodos()

  const handleAddList = () => {
    if (newListTitle) {
      addNewTodoList(newListTitle);
      setNewListTitle('');
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  } 

  if (error)  {
    return <Typography>Error loading lists: {error}</Typography>
  }

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {todoLists?.map((list) => (
              <ListItemButton key={list.id} onClick={() => setActiveList(list)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={list.title} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
        <CardContent>
          <TextField
            label="New List Title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          <Button onClick={handleAddList} color="primary">
            Add New List
          </Button>
        </CardContent>
      </Card>
      {activeList && (
        <TodoListForm
          key={activeList.id}
          todoList={activeList}
          todos={activeList.todos || []}
          saveTodoList={saveTodoList}
          addTodoToList={addTodoToList}
          deleteTodo={deleteTodo}
          toggleTodoCompletion={toggleTodoCompletion}
        />
      )}
    </Fragment>
  )
}
