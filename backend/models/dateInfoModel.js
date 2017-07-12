var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var dateInfoModel = new Schema({
    lineId: { type: String},
    date: { type: Date},
    productionHour: { type: Number},
    goal: { type: Number},
    workers: {type: Number},
    minutesPerProduct: {type: Number},
    planEfficiency: { type: Number},
    planDHULevel: { type: Number}
});

module.exports = mongoose.model('DateInfo', dateInfoModel);