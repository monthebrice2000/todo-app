// backend/routes/todos.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort('position').exec();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one todo
router.get('/:id', getTodo, (req, res) => {
    res.json(res.todo);
});

// CREATE a todo
router.post('/', async (req, res) => {
    try {
        const maxPositionTodo = await Todo.findOne().sort('-position').exec();
        const newPosition = maxPositionTodo ? maxPositionTodo.position + 1 : 1;

        const todo = new Todo({
            title: req.body.title,
            position: newPosition
        });
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a todo
router.patch('/:id', getTodo, async (req, res) => {
    if (req.body.title != null) {
        res.todo.title = req.body.title;
    }
    if (req.body.completed != null) {
        res.todo.completed = req.body.completed;
    }
    try {
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a todo
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

// REORDER todos
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
        todo = await Todo.findById(req.params.id);
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
