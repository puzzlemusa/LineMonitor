var express = require('express');

var routes = function(HourlyInfo, io){
    var hourlyInfoRouter = express.Router();

    var hourlyInfoController = require('../controllers/hourlyInfoController')(HourlyInfo, io);

    hourlyInfoRouter.route('/')
        .post(hourlyInfoController.post)
        .get(hourlyInfoController.get);

    hourlyInfoRouter.use('/:hourId', function(req, res, next){
        HourlyInfo.findById(req.params.hourId, function(err, hourlyInfo){
            if(err){
                res.status(500).send(err);
            }
            else if(hourlyInfo){
                req.hourlyInfo = hourlyInfo;
                next();
            }
            else{
                res.status(404).send('No date found');
            }
        });
    });

    hourlyInfoRouter.route('/:hourId')
        .get(function(req, res){
            //io.emit('productionLineUpdated', { item: req.productionLine.toJSON });
            var returnHourlyInfo = req.hourlyInfo.toJSON();
            res.json(returnHourlyInfo);
        })
        .put(function(req, res){
            req.hourlyInfo.lineId = req.body.lineId;
            req.hourlyInfo.dateId = req.body.dateId;
            req.hourlyInfo.startHour = req.body.startHour;
            req.hourlyInfo.endHour = req.body.endHour;
            req.hourlyInfo.completed = req.body.completed;
            req.hourlyInfo.goal = req.body.goal;
            req.hourlyInfo.dhu = req.body.dhu;
            req.hourlyInfo.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    io.emit('hourUpdated', {
                    });
                    res.json(req.hourlyInfo);
                }
            });
        })
        .patch(function(req, res){
            if(req.body._id){
                delete req.body._id;
            }

            for(var p in req.body){
                req.hourlyInfo[p] = req.hourlyInfo[p];
            }

            req.hourlyInfo.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.json(req.hourlyInfo);
                }
            });
        })
        .delete(function(req, res){
            req.hourlyInfo.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    io.emit('hourUpdated', {
                    });
                    res.status(204).send('Removed');
                }
            });
        });

    return hourlyInfoRouter;
};

module.exports = routes;