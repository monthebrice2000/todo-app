const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *         - color
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the tag
 *         name:
 *           type: string
 *           description: The name of the tag
 *         color:
 *           type: string
 *           description: The color of the tag
 *       example:
 *         id: d5fE_asz
 *         name: Important
 *         color: #ff0000
 */

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: The tags managing API
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Returns the list of all the tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: The list of the tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       201:
 *         description: The tag was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    const tag = new Tag({
        name: req.body.name,
        color: req.body.color
    });
    try {
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/tags/{id}:
 *   patch:
 *     summary: Update the tag by the id
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The tag id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       200:
 *         description: The tag was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request
 *       404:
 *         description: The tag was not found
 */
router.patch('/:id', getTag, async (req, res) => {
    if (req.body.name != null) {
        res.tag.name = req.body.name;
    }
    if (req.body.color != null) {
        res.tag.color = req.body.color;
    }
    try {
        const updatedTag = await res.tag.save();
        res.json(updatedTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Remove the tag by id
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The tag id
 *     responses:
 *       200:
 *         description: The tag was deleted
 *       500:
 *         description: Server error
 */
router.delete('/:id', getTag, async (req, res) => {
    try {
        await Tag.deleteOne({ _id: req.params.id });
        res.json({ message: 'Deleted Tag' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get tag by ID
async function getTag(req, res, next) {
    let tag;
    try {
        tag = await Tag.findById(req.params.id);
        if (tag == null) {
            return res.status(404).json({ message: 'Cannot find tag' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.tag = tag;
    next();
}

module.exports = router;