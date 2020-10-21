const mongoose = require('mongoose');
const { User, userSchema } = require('./users');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    paid: { type: Boolean, required: true },
    provider: { type: String, required: true },
    instructors: { type: Array },
    certificate: { type: Boolean },
    language: { type: String },
    taxonomy: {
        subject: { type: String, required: true },
        category: { type: String, required: true }
    },
    userEvaluations: [{
        user: userSchema,
        rating: { type: Number },
        comment: { type: String },
        date: { type: Date, default: Date.now }
    }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;