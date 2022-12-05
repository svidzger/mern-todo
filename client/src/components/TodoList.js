import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import axios from 'axios';

import AddTodo from './AddTodo';
import UpdateTodo from './UpdateTodo';
import Calendar from './Calendar';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import '../styles/styles.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TodoList() {
  const [todo, setTodo] = useState([]);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    axios
      .get('http://localhost:8000/api/todo')
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addTodo = (todo) => {
    axios
      .post('http://localhost:8000/api/todo', todo)
      .then((res) => {
        if (res.status === 200) {
          getTodos();
          setMsg('Todo added successfully!');
          setOpen(true);
        } else {
          alert('Failed to add Todo');
        }
      })
      .catch((err) => console.error(err));
  };

  const updateTodo = (_id, editedTodo) => {
    axios
      .put(`http://localhost:8000/api/todo/${_id}`, editedTodo)
      .then((res) => {
        if (res.status === 200) {
          getTodos();
          setMsg('Todo updated successfully');
          setOpen(true);
        } else {
          alert('Failed to update Todo');
        }
      })
      .catch((err) => console.error(err));
  };

  const deleteTodo = (_id) => {
    if (window.confirm('Are you sure?')) {
      axios
        .delete(`http://localhost:8000/api/todo/${_id}`)
        .then((res) => {
          if (res.status === 200) {
            getTodos();
            setMsg('Todo deleted successfully!');
            setOpen(true);
          } else {
            alert('Something went wrong');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const columns = [
    {
      headerName: ' Todo title',
      field: 'title',
      cellStyle: { fontSize: '16px' },
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: ' Date & Time',
      field: 'date',
      cellStyle: { fontSize: '16px' },
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: (params) => {
        return moment(params.value).format('DD/MM/YYYY HH:mm');
      },
    },
    {
      headerName: 'Description',
      field: 'description',
      cellStyle: { fontSize: '16px' },
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: '',
      field: '_id',
      width: 60,
      cellRenderer: (params) => (
        <UpdateTodo updateTodo={updateTodo} params={params} />
      ),
    },
    {
      headerName: '',
      field: '_id',
      width: 60,
      cellRenderer: (params) => (
        <Tooltip title="Delete">
          <IconButton
            color="error"
            size="small"
            onClick={() => deleteTodo(params.value)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          marginLeft: 64,
          marginRight: 64,
          display: 'flex',
          padding: 1,
          justifyContent: 'space-around',
        }}
      >
        <AddTodo addTodo={addTodo} />
        <Typography
          variant="h4"
          noWrap
          component="div"
          sx={{
            mr: 2,
            color: 'rgb(0, 0, 0)',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          Todo app
        </Typography>
        <Calendar />
      </Box>
      <div
        className="ag-theme-material"
        style={{ height: 650, width: '38%', margin: 'auto' }}
      >
        <AgGridReact
          rowData={todo}
          columnDefs={columns}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          suppressCellFocus={true}
          suppressRowHoverHighlight={true}
          floatingFiltersHeight={40}
          headerHeight={40}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
          message={msg}
        >
          {msg}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default TodoList;
