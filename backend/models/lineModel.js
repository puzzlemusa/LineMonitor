var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var lineModel = new Schema({
    lineName: { type: String},
    lineType: { type: String}
});

module.exports = mongoose.model('Line', lineModel);