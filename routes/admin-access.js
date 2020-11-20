const express = require('express');
const router = express.Router();
const { Course, courseSchema } = require('../models/courses');


router.get('/course-register', (req, res) => {
    res.render('course-register.ejs', {
        title: 'Course Registration'
    });
});

router.post('/course-register', (req, res) => {

    try {
        const course = {
            title: req.body.title,
            description: req.body.description,
            isPaid: !!req.body.isPaid,
            price: req.body.price,
            currency: req.body.currency,
            provider: req.body.provider,
            fromUniversity: !!req.body.fromUniversity,
            educationalInstitution: req.body.educationalInstitution,
            instructors: req.body.instructors.split(',').map(item => item.trim()),
            haveCertificate: !!req.body.haveCertificate,
            language: req.body.language,
            taxonomy: {
                subject: req.body.subject,
                category: req.body.category
            }
        };
        console.log(course);

        new Course(course).save().then(() => {
            console.log('Curso Salvo!');
            res.redirect('/admin/course-register');
        }).catch((err) => {
            console.log("Erro ao registrar novo curso à BD: " + err);
        });

    } catch (err) {
        console.log("Server error: " + err);
        res.redirect('/admin/course-register');
    }

});

module.exports = router;