const express = require('express');
const router = express.Router();
const Tarefas = require('../model/tarefa');

router.get('/tarefas/novo', async (req, res) => {
  res.render('tarefas/novo');
});

router.post('/tarefas/salvar', (req, res) => {
  const titulo = req.body.titulo;
  const materia = req.body.materia;
  const fechamento = req.body.fechamento;
  const status = req.body.status;

  Tarefas.create({
    titulo: titulo,
    materia: materia,
    fechamento: fechamento,
    status: status,
  }).then((tarefa) => {
    if (tarefa === undefined) {
      res.redirect('/');
    } else {
      res.redirect('/tarefas');
    }
  });
});

router.get('/tarefas', async (req, res) => {
  try {
    const tarefas = await Tarefas.findAll();
    res.render('tarefas/index', { Tarefas: tarefas });
  } catch (error) {
    console.log(error);
  }
});

router.get('/tarefas/editar/:id', (req, res) => {
  const id = req.params.id;
  Tarefas.findByPk(id).then((tarefa) => {
    res.render('tarefas/editar', { tarefa });
  });
});

router.post('/tarefas/alterar', (req, res) => {
  const id = req.body.id;
  const titulo = req.body.titulo;
  const materia = req.body.materia;
  const status = req.body.status;
  const fechamento = req.body.fechamento;

  Tarefas.update(
    {
      titulo: titulo,
      status: status,
      fechamento: fechamento,
      materia: materia,
    },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect('/tarefas');
  });
});

router.get('/tarefas/excluir/:id', (req, res) => {
  const id = req.params.id;

  Tarefas.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect('/tarefas');
  });
});

module.exports = router;
