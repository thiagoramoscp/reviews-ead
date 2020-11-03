const mongoose = require('mongoose');
const { User, userSchema } = require('./users');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    isPaid: { type: Boolean, required: true },
    price: { type: Number },
    currency: { type: String },
    provider: { type: String, required: true },
    fromUniversity: { type: Boolean, required: true },
    instructors: { type: Array },
    haveCertificate: { type: Boolean },
    language: { type: String, required: true },
    taxonomy: {
        subject: { type: String, required: true },
        category: { type: String, required: true }
    },
    review: {
        rating: { type: Number },
        userEvaluations: [{
            user: userSchema,
            rating: { type: Number },
            comment: { type: String },
            date: { type: Date, default: Date.now }
        }]
    }
});

const Course = mongoose.model('Course', courseSchema);

exports.Course = Course;
exports.courseSchema = courseSchema;