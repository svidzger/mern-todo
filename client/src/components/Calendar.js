import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

const localizer = momentLocalizer(moment);

function TodoCalendar() {
  const [todo, setTodo] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get('http://localhost:8000/api/todo')
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const myTodoList = todo.map((todo) => {
    let date = new Date(todo.date);
    const todoDetails = {
      start: new Date(todo.date),
      end: new Date(moment(date).add(60, 'minutes')),
      title: todo.title + '/' + todo.description,
    };
    return todoDetails;
  });

  return (
    <React.Fragment>
      <Button
        style={{ marginTop: 4, marginRight: 1 }}
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
      >
        Calendar
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogActions>
          <IconButton color="error" onClick={handleClose}>
            <CancelIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <div>
            <Calendar
              localizer={localizer}
              events={myTodoList}
              startAccessor="start"
              endAccessor="end"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                width: '124vh',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default TodoCalendar;
