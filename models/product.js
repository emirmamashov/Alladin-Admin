var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    cy: {type: String},
    metaTegs: {
        description: {type: String},
        keywords: {type: String},
        author: {type: String}
    }
});

module.exports = mongoose.model('Product', schema);
