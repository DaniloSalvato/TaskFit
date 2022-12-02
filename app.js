const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');

const connection = require('./database/database');
const checklogin = require('./middleware/checklogin');

// Models
const Usuario = require('./model/usuario');
const Tarefa = require('./model/tarefa');
const Tarefas = require('./model/tarefa');

// Controllers
const UsuarioController = require('./controllers/usuariosController');
const TarefaController = require('./controllers/tarefasController');

const app = express();

// Environment Setup
// Static Files Activation
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'js')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Sessions
app.use(
  session({
    secret: 'tasklist',
    cookie: {
      maxAge: 1200000,
    },
    resave: false,
    saveUnitialized: false,
  })
);

// Form parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database
connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com sucesso!');
  })
  .catch((error) => {
    console.log(error);
  });

// Access from other origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-Width, Content-type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Rotas
app.get('/', checklogin, (req, res) => {
  res.render('index');
});


app.get('/login', (req, res) => {
  res.render('login', { msg: '' });
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  Usuario.findOne({
    where: {
      email: email,
    },
  }).then((usuario) => {
    if (usuario !== undefined) {
      const deuCerto = bcrypt.compareSync(senha, usuario.senha);

      if (deuCerto) {
        req.session.login = {
          nome: usuario.nome,
        };

        res.redirect('/');
      } else {
        res.render('login', { msg: 'Usuário ou senha inválidos!' });
      }
    } else {
      res.render('login', { msg: 'Usuário ou senha inválidos!' });
    }
  });
});

// Rotas externas
app.use('/', UsuarioController);
app.use('/', TarefaController);

app.listen(3000, () => "Porta 3000");

module.exports = app;
