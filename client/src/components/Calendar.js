import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function TodoCalendar() {
  const [todo, setTodo] = useState([]);

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
          height: '100vh',
        }}
      />
    </div>
  );
}

export default TodoCalendar;
