# MERN todo sovellus

MERN-lyhenne tarkoittaa MongoDB, Express, React, Node. **MongoDB** on NoSQL mallinen tietokanta, **Express** käytetään pääasiassa Node.js-verkkokehyksen kehittämiseen, **React** on Facebookin kehittämä kehys interaktiivisten käyttöliittymien ja verkkosovellusten rakentamiseen ja viimeinen mutta ei vähäisin **Node.js**, mikä käytetään palvelinpuolen ohjelmointiin. Kaikki ne yhdessä muodostuvat MERN-stack joka on perinteinen 3 full-stack sovellus, missä back-end on toteutettu käyttäen **Node.js** ja **Express**, tietokanta on toteutettu käyttäen **MongoDB** ja sovelluksen front-end on kirjoitettu **React** frameworkilla.

Kirjoitin MERN-stack todo sovelluksen käyttäen kaikki yllämainitut teknologiat. Lähdekoodini ja videoesitykseni ovat saatavilla [GitHub-sivulla](https://github.com/svidzger/mern-todo) ja [MicrosoftStream](https://web.microsoftstream.com/video/74859497-e94e-4866-99f2-62afa48810ed) palvelussa.

---

## Three-tier architecture, eli Kolmikerroksinen arkkitehtuuri

![three-tier architecture app](https://upload.wikimedia.org/wikipedia/commons/5/51/Overview_of_a_three-tier_application_vectorVersion.svg)

Tässä kuvassa näkyy miten tälläinen arkkitehtuuri toimii. Tämä tapa on vakiimtunut ja laajasti käytössä. Sovelluksen jokainen taso toimii omalla infrastruktuurillaan. Sen takia jokaista tasoa voi kehittää samanaikaisesti erillinen kehitystiimi ja sitä voi päivittää vaikuttamatta muita tasoja. Se on tosi vanha ja perinteinen arkkitehtuuri. Nykyään kolmikerroksiset sovellukset yleensä halutaan modernisoida pilvipohjaisilla teknogolijoilla esim. _kontit ja mirkopalvelut_.

**Presentation tier** (Esitystaso) - on käyttöliittymä ja viestintäkerros, missä käyttäjä on vuorovaikutuksessa sovelluksen kanssa. Se tarkoitus on näyttää ja kerätä dataa käyttäjältä.

**Application tier** (Sovellustaso) - on logiikkataso, missä esitystasolla kerätyt tiedot käsitellään. Tällä tasolla on esimmerkiksi toteutettu **CRUD** (_**C**reate_, _**R**ead_, _**U**pdate_, _**D**elete_) logiikka ja yhteys tietokantaan.

**Data tier** (Datataso) - on tietokantataso, missä sovelluksen käsittelemät tiedot tallennetaan ja hallitaan. Tämä voi olla relaatiotietokannan hallintajärjestelmä **SQL** tai **NoSQL**-tietokanta, joka sisältää tiedot yhdessä tietorakenteessa, kuten JSON-dokumentti.

---

## Server ja CRUD toiminnot

Olen aina kiinnostunut kokeilla jotain uutta. Tässä projektissa **MongoDB**, **Mongoose** ja **Express** olivat minulle uusia konsepteja. Vaikeuksia oli vähän, mutta selvisin aika hyvin. Kun en tiedä paljon aiheesta niin aina luen tarkasti ja huolellisesti dokumentaation. Olen käyttänyt [Mongoose](https://mongoosejs.com/docs/guide.html), [Express](https://expressjs.com/en/guide/routing.html), [React](https://reactjs.org/docs/getting-started.html) dokumentaatio sivut.

MongoDB on ilmainen NoSQL tietokant, joka käyttää merkittävästi erilaista lähestymistapaa tietojen tallentamiseen. Tiedot edustetaan sarjana JSON-tyyppisiä asiakirjoja.

Tässä projektissa olen käyttänyt Mongoose, joka on Object Data Modeling (ODM) -kirjasto MongoDB:lle. Mongoose tarjoaa kaavapohjaisen ratkaisun sovellustietojen mallintamiseen. Mongoose-skeema määrittelee dokumentin rakenteen, oletusarvot, validaattorit jne. Se on hyvin suoraviivainen ja hyvin dokumentoitu.

Tässä on minun projektin Mongoose-kaavio ja malli. Se on simppeli ja sitä on helppoa lukea ja muokata.

```
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for todo
const TodoSchema = new Schema({
  title: {
    type: 'String',
    required: true,
  },
  date: {
    type: Date,
  },
  description: {
    type: 'String',
  },
});

const Todo = mongoose.model('todo', TodoSchema);

module.exports = Todo;
```

Tässä on sovelluksen Mongoose **CRUD** toiminnot. Se hakee, lisää tai muokkaa data tietokannassa.

```
// Todo mongoose model
const Todo = require('../models/todo');

// Show all todos
exports.getAllTodos = (req, res) => {
  Todo.find()
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) =>
      res.status(404).json({ message: 'Todos not found', error: err.message })
    );
};

// Create a new todo
exports.createTodo = (req, res) => {
  Todo.create(req.body)
    .then((todo) => {
      res.json({ message: 'Todo added successfully!', todo });
    })
    .catch((err) =>
      res.status(400).json({
        message: 'Unable to add new todo!',
        error: err.message,
      })
    );
};

// Update existing todo
exports.updateTodo = (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, req.body)
    .then((todo) => {
      return res.json({ message: 'Todo updated successfully!', todo });
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: 'Unable to update todo!', message: err.message })
    );
};

// Delete todo
exports.deleteTodo = (req, res) => {
  Todo.findByIdAndRemove(req.params.id, req.body)
    .then((todo) => {
      return res.json({ message: 'Todo deleted successfully!', todo });
    })
    .catch((err) =>
      res
        .status(404)
        .json({ error: 'Failed to delete todo!', message: err.message })
    );
};

```

Projektissa on otettu käyttöön MongoDB Atlas, mikä on Database-as-a-Service (DBaas). MongoDB Atlas on täysin hallittu pilvitietokanta, joka hoitaa käyttöönoton ja hallinnan pilvipalveluntarjoajalla, kuten AWS tai Azure.

Tietokantaan muodostetaan yhteyttä conn.js tiedostossa ja linkki tietokantaan sijaitsee .env tiedostossa.

```
const mongoose = require('mongoose');

const connectMongo = () => {
  try {
    mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo database is connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectMongo;
```

ATLAS_URI linkin < password > kohdan vaihdetaan tietokannan järjestelmänvalvojan salasanalle, niin pääse muokkaamaan tai lisäämään tietoja tietokantaan.

```
ATLAS_URI=mongodb+srv://ger:<password>@cluster1.peckizs.mongodb.net/?retryWrites=true&w=majority
```

Server.js sisällä on koodi joka käynnistää Express server ja yhdistää tietokantaan. Dotenv on moduuli, joka lataa ympäristömuuttujat. CORS on selaimien toteuttama suojausprotokolla, jonka avulla voimme käyttää resursseja eri alkuperästä.

```
require('dotenv').config({ path: './config/.env' });
const connectMongo = require('./config/conn.js');
const cors = require('cors');
const express = require('express');
const app = express();

// Todo routes
const todo = require('./routers/todo');

// Connection to Mongo database
connectMongo();

// Cors
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.use('/api/todo', todo);

const port = process.env.port || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

## Client puoli ja ulkoasu

Käyttäjä puoli on toteutettu Reactilla. Asensin React kirjastot, kuten:

- [Material UI](https://mui.com/material-ui/getting-started/overview/) on kirjasto komponenteja jotka toteuttaa Googlen materiaalisuunnittelun.
- [AG Grid](https://www.ag-grid.com/) on tosi hyvä JavaScript Grid.
- [Axios](https://axios-http.com/) on Javascript-kirjasto, jota käytetään HTTP-pyyntöjen tekemiseen.
- [React Big Calendar](https://jquense.github.io/react-big-calendar/examples/?path=/story/about-big-calendar--page) joka näyttää todo kalenterissa.

Client kansion on luottu `npx create-react-app` komennolla uusi react sovellus pohja. Poistin kaikki ylimääräiset kohdat App.js tiedostosta ja lisäsin sinne `<TodoList />` joka on sovelluksen pääsivu.

```
import './App.css';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
```

Components kansioon on luottu neljä komponenttia `AddTodo.js, TodoList.js, UpdateTodo.js ja Calendar.js`.
Minulle oli kaikkein haastavin kirjoittaa front-end logiikka. CRUD toimintojen kanssa jäin hieman jumiin, koska full-stack kehitys oli minulle uutta ja tuntematonta. Kuitenkin sain kaiken toimimaan. Alhalla on `TodoList.js`. Tässä Axios tekee **HTTP** pyyntöjä serverille ja tekee **CRUD** operatioita. **AG Grid** ja **Material UI** vastaavat
funktionaalisesta ja miellyttävästä front-end:stä.

```import React, { useState, useEffect } from 'react';
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
```

`AddTodo.js` ja `UpdateTodo.js` molemmat ovat komponenteja ja sisältävät UI ponnahdusikkuna todo lisäämistä tai päivittämistä varten. Näiden kirjoittamisella ei ollut paljon vaikeuksia, koska minulla on jo kokemus käyttämään React kirjastoa.

```
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

```

---

```
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

```

Viimeinen `Calendar.js` tiedosto vastaa kalenterista. Olen käyttänyt sama kalenteri komponenttia. En törmänyt ongelmiin tässä vaiheessa.

```
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

```

## Loppusanat

Tämä projekti oli tosi mielenkiintoinen. Kurssin jälkeen mietin, että vapaa-ajallani yritän syventyä enemmän MERN-stack:iin. Se on mielenkiintoinen konsepti ja olen oppinut paljon. MongoDB ja muuten NoSQL tietokantamalli on kiinnostava. Olen tehnyt vain SQL tietokantoja ennen tätä projektia. Aiemmin en myöskään ole tehnyt sekä Back-end että Front-end samassa projektissa. Haluan jatkaa taitojeni kehittämistä täyden pinon kehittäjänä.
