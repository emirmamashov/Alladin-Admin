var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var fs = require('fs');
var csv = require('fast-csv');
var XLSX = require('xlsx');

var Product = require('../models/product');
var Category = require('../models/category');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function(err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for(var i=0; i<docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('product/index', { title: 'Alladin админ-панель продукты', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/create', isLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    console.log(messages);
    Category.find(function(err, docs){
        res.render('product/create', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
    });
});

router.post('/create',isLoggedIn,function (req, res, next) {
    var product = new Product({
        title: req.body.title,
        imagePath: '',
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
    });

    console.log(req.body);

    product.save(function(err) {
        if (err) {
            console.log('Product not saved successfully!'+err);
            var messages = [];
            messages.push(err);
            Category.find(function(err, docs){
                res.render('product/create', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', categories: docs,  messages: messages, hasErrors: messages.length});
            });
        } else {
            console.log('Product saved successfully!');
            res.redirect('/product/');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    var productId = req.params.id;

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
            //res.render('product/edit', { title: 'Alladin админ-панель', product: product, successMsg: successMsg, noMessages: !successMsg});
        }
        Category.find(function(err, docs){
            var messages = [];
            messages.push(err);
            res.render('product/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', product: product, categories: docs,  messages: messages, hasErrors: messages.length});
        });
    });
});

router.post('/edit', function(req, res, next) {
    var productId = req.body._id;
    Product.findById(productId, function(err, product) {
        if (err) {
            var messages = [];
            messages.push("product not founded!");
            Category.find(function(err, docs){
                res.render('product/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', product: product, categories: docs,  messages: messages, hasErrors: messages.length});
            });
        }

        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;

        product.save(function(err) {
            if (err) {
                console.log('Product not saved successfully!'+err);
                var messages = [];
                messages.push(err);
                Category.find(function(err, docs){
                    res.render('product/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты', product: product, categories: docs,  messages: messages, hasErrors: messages.length});
                });
            } else {
                console.log('Product saved successfully!');
                res.redirect('/product/');
            }
        });
    });
});

router.get('/delete/:id', function(req, res, next) {
    var productId = req.params.id;
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/product/');
            //res.render('product/edit', { title: 'Alladin админ-панель', product: product, successMsg: successMsg, noMessages: !successMsg});
        }
        product.remove(function(error) {
            if (error) {
                throw error;
                console.log(err);
            }
            console.log('Product deleted!');
            res.redirect('/product/');
        });
    });
});

router.get('/import', isLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    console.log(messages);
    res.render('product/import', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length});
});

router.post('/import', isLoggedIn, function(req, res, next) {
    console.log(req.files);

    var multiparty = require("multiparty");
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files){
        console.log(files.file[0]);
        var fileUrl = files.file[0].path;

        /* Call XLSX */
        var workbook = XLSX.readFile(fileUrl);
        //console.log(workbook);
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Find desired cell */
        var desired_cell = worksheet[address_of_cell];

        /* Get the value */
        var desired_value = desired_cell.v;
        var results = XLSX.utils.sheet_to_json(worksheet,{raw:true});
        console.log(results);
        console.log(results[0].Name);
        for(var i=0; i<results.length; i++) {
            var product = new Product({
                title: results[i].Name,
                imagePath: '',
                description: results[i].Description,
                price: results[i].Price
            });

            product.save(function(err) {
                if (err) {
                    console.log('Product not saved successfully!'+err);
                    var messages = [];
                    messages.push(err);
                    return res.render('product/import', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length});
                }
            });

        }
        req.flash('success', 'Successfully add products!');
        res.redirect('/');
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