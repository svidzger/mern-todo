import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function UpdateTodo(props) {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState({
    title: '',
    date: '',
    description: '',
  });

  const handleClickOpen = () => {
    setTodo({
      title: props.params.data.title,
      date: props.params.data.date,
      description: props.params.data.description,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    props.updateTodo(props.params.value, todo);
    handleClose();
  };

  const inputChanged = (e) => {
    e.preventDefault();
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  return (
    <React.Fragment>
      <Tooltip title="Update todo">
        <IconButton color="primary" size="small" onClick={handleClickOpen}>
          <ChangeCircleIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogActions>
          <IconButton color="error" onClick={handleClose}>
            <CancelIcon />
          </IconButton>
        </DialogActions>
        <DialogTitle textAlign="center">Update todo</DialogTitle>
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

export default UpdateTodo;
