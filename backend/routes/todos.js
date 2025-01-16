const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const Tag = require('../models/Tag');

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         completed:
 *           type: boolean
 *           description: The completion status of the todo
 *         position:
 *           type: number
 *           description: The position of the todo
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *       example:
 *         id: d5fE_asz
 *         title: Buy groceries
 *         completed: false
 *         position: 1
 *         tags: []
 */

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: The todos managing API
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Returns the list of all the todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: The list of the todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort('position').populate('tags').exec();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos/search:
 *   get:
 *     summary: Search and filter todos
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: The title of the todo
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: The completon status of the todo
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: The tag id
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of todos per page
 *     responses:
 *       200:
 *         description: The list of the filtered todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/search', async (req, res) => {
    const { title, completed, tag, page = 1, limit = 10 } = req.query;
    const query = {};

    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }

    if (completed !== undefined) {
        query.completed = completed === 'true';
    }

    if (tag) {
        query.tags = tag;
    }

    try {
        const todos = await Todo.find(query)
            .sort('position')
            .populate('tags')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();
        const count = await Todo.countDocuments(query);
        res.json({
            todos,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get the todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The todo description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: The todo was not found
 */
router.get('/:id', getTodo, (req, res) => {
    res.json(res.todo);
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The todo was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    try {
        const maxPositionTodo = await Todo.findOne().sort('-position').exec();
        const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;

        const todo = new Todo({
            title: req.body.title,
            position: newPosition,
            tags: req.body.tags
        });
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Update the todo by the id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The todo was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The todo was not found
 */
router.patch('/:id', getTodo, async (req, res) => {
    if (req.body.title != null) {
        res.todo.title = req.body.title;
    }
    if (req.body.completed != null) {
        res.todo.completed = req.body.completed;
    }
    if (req.body.tags != null) {
        res.todo.tags = req.body.tags;
    }
    try {
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Remove the todo by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: The todo was deleted
 *       500:
 *         description: Server error
 */
router.delete('/:id', getTodo, async (req, res) => {
    try {
        const deletedTodo = await Todo.findById(req.params.id);
        await Todo.deleteOne({ _id: req.params.id });
        
        // Mettre à jour les positions des todos restants
        await Todo.updateMany(
            { position: { $gt: deletedTodo.position } },
            { $inc: { position: -1 } }
        );
        
        res.json({ message: 'Deleted Todo' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/todos/reorder:
 *   put:
 *     summary: Reorder todos
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todos:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid data format
 *       500:
 *         description: Server error
 */
router.put('/reorder', async (req, res) => {
    const { todos } = req.body; // Array de todos avec les nouvelles positions

    if (!Array.isArray(todos)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const bulkOps = todos.map((todo, index) => ({
            updateOne: {
                filter: { _id: todo._id },
                update: { position: index + 1 }
            }
        }));

        await Todo.bulkWrite(bulkOps);
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get todo by ID
async function getTodo(req, res, next) {
    let todo;
    try {
        todo = await Todo.findById(req.params.id).populate('tags');
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.todo = todo;
    next();
}

module.exports = router;