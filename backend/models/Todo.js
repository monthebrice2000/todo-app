const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        default: 0
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        index: true
    }],
    priority: {
        type: String,
        enum: ['haute', 'moyenne', 'basse'],
        default: 'moyenne'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Todo', TodoSchema);