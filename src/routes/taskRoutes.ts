import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  patchTask,
} from '../controllers/taskController';
import { strictLimiter } from '../middlewares/rateLimiter';

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupère la liste des tâches
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche dans le titre et la description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt, title, updatedAt]
 *           default: createdAt
 *         description: Champ de tri
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrevious:
 *                   type: boolean
 */
router.get('/', getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Récupère une tâche par son ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de la tâche
 *     responses:
 *       200:
 *         description: Détails de la tâche
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 */
router.get('/:id', getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crée une nouvelle tâche
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de la tâche
 *               description:
 *                 type: string
 *                 description: Description de la tâche
 *               completed:
 *                 type: boolean
 *                 description: Statut de la tâche
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/', strictLimiter, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Met à jour une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *       404:
 *         description: Tâche non trouvée
 *       400:
 *         description: Erreur de validation
 */
router.put('/:id', strictLimiter, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Met à jour partiellement une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *       404:
 *         description: Tâche non trouvée
 *       400:
 *         description: Erreur de validation
 */
router.patch('/:id', strictLimiter, patchTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprime une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de la tâche
 *     responses:
 *       204:
 *         description: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 */
router.delete('/:id', strictLimiter, deleteTask);

export default router;
