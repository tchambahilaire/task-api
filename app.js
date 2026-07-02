const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ============ MIDDLEWARES ============
app.use(cors());
app.use(express.json());

// ============ STOCKAGE EN MÉMOIRE ============
const tasks = new Map();
let taskId = 1;

// ============ ROUTES ============

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Task',
    endpoints: {
      health: 'GET /health',
      tasks: 'GET /tasks',
      taskDetail: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API fonctionne !',
    tasksCount: tasks.size,
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne !' });
});

// GET /tasks - Liste toutes les tâches (avec pagination)
app.get('/tasks', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const allTasks = Array.from(tasks.values());
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allTasks.slice(start, end);
  
  res.json({
    success: true,
    data,
    total: allTasks.length,
    page,
    limit,
    totalPages: Math.ceil(allTasks.length / limit)
  });
});

// GET /tasks/:id - Récupère une tâche
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.get(id);
  
  if (!task) {
    return res.status(404).json({ 
      success: false, 
      error: 'Tâche non trouvée' 
    });
  }
  
  res.json({ success: true, data: task });
});

// POST /tasks - Crée une tâche
app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;
  
  // Validation
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Le titre est requis'
    });
  }
  
  const task = {
    id: taskId++,
    title: title.trim(),
    description: description?.trim() || '',
    completed: completed || false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.set(task.id, task);
  
  res.status(201).json({
    success: true,
    message: 'Tâche créée avec succès',
    data: task
  });
});

// PUT /tasks/:id - Met à jour une tâche
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.get(id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Tâche non trouvée'
    });
  }
  
  const { title, description, completed } = req.body;
  
  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description.trim();
  if (completed !== undefined) task.completed = completed;
  task.updatedAt = new Date();
  
  tasks.set(id, task);
  
  res.json({
    success: true,
    message: 'Tâche mise à jour',
    data: task
  });
});

// DELETE /tasks/:id - Supprime une tâche
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (!tasks.has(id)) {
    return res.status(404).json({
      success: false,
      error: 'Tâche non trouvée'
    });
  }
  
  tasks.delete(id);
  res.status(204).send();
});

// Favicon (pour éviter les erreurs 404 du navigateur)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// ============ MIDDLEWARES D'ERREUR ============

// Route 404 - DOIT ÊTRE APRÈS TOUTES LES ROUTES
app.use((req, res) => {
  console.log(`❌ Route non trouvée: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

// ============ DÉMARRAGE DU SERVEUR ============
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`📋 Test: http://localhost:${PORT}/test`);
  console.log(`📚 Tasks: http://localhost:${PORT}/tasks\n`);
});

console.log('✅ API prête !');
