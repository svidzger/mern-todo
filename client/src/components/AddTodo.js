import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function AddTodo(props) {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState({
    title: '',
    date: '',
    description: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    props.addTodo(todo);
    handleClose();
  };

  const inputChanged = (e) => {
    e.preventDefault();
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };
  return (
    <React.Fragment>
      <Button
        style={{ marginTop: 4, marginRight: 1 }}
        color="success"
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={handleClickOpen}
      >
        New Todo
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogActions>
          <IconButton color="error" onClick={handleClose}>
            <CancelIcon />
          </IconButton>
        </DialogActions>
        <DialogTitle textAlign="center">New Todo</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            value={todo.title}
            onChange={inputChanged}
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date and Time"
              value={todo.date}
              onChange={(date) => {
                // const formatDate = date.toISOString();
                setTodo({ ...todo, date: date });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            name="description"
            value={todo.description}
            onChange={inputChanged}
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AddTodo;
