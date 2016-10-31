var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    parentCategory: {type: Schema.Types.ObjectId, ref: 'Category'},
    metaTegs: {
        description: {type: String},
        keywords: {type: String},
        author: {type: String}
    }
});

module.exports = mongoose.model('Category', schema);
