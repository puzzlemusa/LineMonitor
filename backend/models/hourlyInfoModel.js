var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hourlyInfoModel = new Schema({
    lineId: {type: String},
    dateId: {type: String},
    startHour: { type: Number},
    endHour: { type: Number},
    completed: { type: Number},
    goal: { type: Number},
    dhu: {type: Number}
});

module.exports = mongoose.model('HourlyInfo', hourlyInfoModel);