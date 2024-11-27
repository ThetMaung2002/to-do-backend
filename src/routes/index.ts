import { Router } from 'express';
import { db } from '../database/database';

const router = Router();

// Home Route
router.get('/', (req, res) => {
  const dashboardData = {
    recentActivity: 'Updated your task list and added new entries.',
    statistics: 'You\'ve completed 5 out of 10 tasks this week.',
    messages: 'You have 3 unread messages.',
  };

  res.render('home/index', { dashboardData });
});

// About Route
router.get('/about', (req, res) => {
  // You can add any dynamic data here if needed
  res.render('about/index'); // Rendering the about page
});

// Tasks Routes
router.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, tasks) => {
    if (err) {
      return res.status(500).render('error', { error: err.message });
    }
    res.render('tasks/index', { tasks });
  });
});

router.get('/tasks/new', (req, res) => {
  res.render('tasks/new');
});

router.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  db.run(
    'INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)',
    [title, description, false],
    function (err) {
      if (err) {
        return res.status(500).render('error', { error: err.message });
      }
      res.redirect('/tasks');
    }
  );
});

router.get('/tasks/:id/edit', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) {
      return res.status(500).render('error', { error: err.message });
    }
    res.render('tasks/edit', { task });
  });
});

router.post('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  db.run(
    'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
    [title, description, completed ? true : false, id],
    function (err) {
      if (err) {
        return res.status(500).render('error', { error: err.message });
      }
      res.redirect('/tasks');
    }
  );
});

router.post('/tasks/:id/delete', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).render('error', { error: err.message });
    }
    res.redirect('/tasks');
  });
});

export default router;