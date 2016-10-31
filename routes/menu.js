var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Menu = require('../models/menu');
var Category = require('../models/category');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', isLoggedIn, function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Menu.find(function(err, docs) {
        res.render('menu/index', {title: 'Alladin админ-панель-меню', menu: docs, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/create', isLoggedIn, function(req, res, next) {
    var messages = req.flash('error');
    Category.find(function(err, docs) {
        if (err) {
            res.redirect('/');
        }
        res.render('menu/create', {csrfToken: req.csrfToken(), title: 'Alladin админ-панель создание', categories: docs, messages: messages, hasErrors: messages.length});
    });
});

router.post('/create', isLoggedIn, function(req, res, next) {
    console.log(req.body);
    var children = [];
    for(var i=0; i<req.body.childrenTitle.length; i++) {
        var newChildren = {
            title: req.body.childrenTitle[i],
            href: req.body.childrenHref[i],
            category: req.body.childrenCategory[i]
        };

        children.push(newChildren);
    }
    var menu = new Menu({
       title: req.body.title,
       href: req.body.href,
       category: req.body.category,
       bgcolor: req.body.bgcolor,
       children: children
    });

    console.log("---------children: "+children);
    console.log("---------"+ menu);

    menu.save(function(err) {
        if(err) {
            console.log('Menu not saved!');
            var messages = [];
            messages.push(err);
            console.log(messages);
            Category.find(function(err, docs) {
                console.log("category: "+docs);
                res.render('menu/create', {csrfToken: req.csrfToken(), title: 'Alladin админ-панель создание', categories: docs, messages: messages, hasErrors: messages.length});
            });
        } else {
            console.log('Menu saved successfully!');
            res.redirect('/menu/');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    var menuId = req.params.id;

    Menu.findById(menuId, function (err, menu) {
        console.log(menu);
        if(err) {
            return res.redirect('/menu/');
        }

        Category.find(function(err, docs) {
            var messages = [];
            messages.push(err);
            var hasChildren = menu.children.length>0?true:false;
            console.log("hasChildren: "+hasChildren);
            res.render('menu/edit', { csrfToken: req.csrfToken(), title: 'Alladin админ-панель продукты',
                menu: menu, hasChildren: hasChildren,
                categories: docs,  messages: messages, hasErrors: messages.length});
        });

    })
});

router.post('/edit', function(req, res, next) {
    var menuId = req.body._id;
    var children = [];
    for(var i=0; i<req.body.childrenTitle.length; i++) {
        var newChildren = {
            title: req.body.childrenTitle[i],
            href: req.body.childrenHref[i],
            category: req.body.childrenCategory[i]
        };

        children.push(newChildren);
    }
    Menu.findById(menuId, function (err, menu) {
        if (err) {
            Category.find(function(err, docs) {
                var messages = [];
                messages.push(err);
                res.render('menu/edit', {csrfToken: req.csrfToken(), title: 'Редактировать', menu: req.body, categories: docs, messages: messages, hasErrors: messages.length});
            });
        } else {
            menu.title = req.body.title;
            menu.href = req.body.href;
            menu.category = req.body.category;
            menu.bgcolor = req.body.bgcolor;
            menu.children = children;

            menu.save(function(err) {
                if(err) {
                    console.log('Menu not saved!');
                    var messages = [];
                    messages.push(err);
                    Category.find(function(err, docs) {
                        messages.push(err);
                        res.render('menu/edit', {csrfToken: req.csrfToken(), title: 'Alladin админ-панель создание', menu: menu, categories: docs, messages: messages, hasErrors: messages.length});
                    });
                } else {
                    console.log('Menu editing successfully!');
                    res.redirect('/menu/');
                }
            });
        }
    });
});

router.get('/delete/:id', function(req, res, next) {
    var menuId = req.params.id;

    Menu.findById(menuId, function (err, menu) {
        console.log(menu);
        if(err) {
            return redirect('/menu/');
        } else {
            menu.remove(function(err) {
               if (err) {
                   throw err;
                   console.log(err);
               }
                res.redirect('/menu/');
            });
        }

    })
});
module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.oldUrl;
    res.redirect('/user/signin');
}

