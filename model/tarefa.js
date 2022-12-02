const Sequelize = require('sequelize');

const connection = require('../database/database');

const Tarefas = connection.define('tarefa', {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  materia: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fechamento: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Tarefas.sync({ force: true });

module.exports = Tarefas;
