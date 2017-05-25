var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Category = require('../models/category');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Category.find(function(err, docs){
        res.render('category/index', { title: 'Alladin админ-панель продукты', categories: docs, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/create', isLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    console.log(messages);
    Category.find(function(err, docs){
        res.render('category/create', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
    });
});

router.post('/create',isLoggedIn,function (req, res, next) {
    var category = new Category({
        name: req.body.name,
        parentCategory: req.body.category?req.body.category:null
    });
    console.log(req.body);
    category.save(function(err) {
        if (err) {
            console.log('Category not saved successfully!'+err);
            var messages = [];
            messages.push(err);
            Category.find(function(err, docs){
                res.render('category/create', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
            });
        } else {
            console.log('Product saved successfully!');
            res.redirect('/category/');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    var categoryId = req.params.id;

    Category.findById(categoryId, function(err, category) {
        if (err) {
            return res.redirect("/category");
        }
        Category.find(function(err, docs){
            var messages = [];
            messages.push(err);
            res.render('category/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
        });
    });
});

router.post('/edit', function(req, res, next) {
    var categoryId = req.body._id;
    Category.findById(categoryId, function(err, category) {
        if (err) {
            Category.find(function(err, docs){
                var messages = [];
                messages.push(err);
                res.render('category/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
            });
        }

        category.name = req.body.name;
        category.parentCategory = req.body.category;

        category.save(function(err) {
            if (err) {
                console.log('category not saved successfully!'+err);
                Category.find(function(err, docs){
                    var messages = [];
                    messages.push(err);
                    res.render('category/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
                });
            } else {
                console.log('category saved successfully!');
                res.redirect('/category/');
            }
        });
    });
});

router.get('/delete/:id', function(req, res, next) {
    var categoryId = req.params.id;
    Category.findById(categoryId, function(err, product) {
        if (err) {
            return res.redirect('/category/');
            //res.render('product/edit', { title: 'Alladin админ-панель', product: product, successMsg: successMsg, noMessages: !successMsg});
        }
        product.remove(function(err) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('Category deleted!');
            res.redirect('/category/');
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}