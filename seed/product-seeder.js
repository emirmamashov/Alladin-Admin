var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/alladin');

var products = [
    new Product({
        imagePath:'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Githic Video Game',
        description: 'Awesome game!',
        price: 10,
        metaTegs: [
            {description: 'Video game'},
            {keywords: 'game'},
            {author: 'valve'}
        ]
    })
];

var done = 0;
for(var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if(done === products.length) {
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}