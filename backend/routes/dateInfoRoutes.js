var express = require('express');

var routes = function(DateInfo, io){
    var dateInfoRouter = express.Router();

    var dateInfoController = require('../controllers/dateInfoController')(DateInfo, io);

    dateInfoRouter.route('/')
        .post(dateInfoController.post)
        .get(dateInfoController.get);

    dateInfoRouter.use('/:dateId', function(req, res, next){
        DateInfo.findById(req.params.dateId, function(err, dateInfo){
            if(err){
                res.status(500).send(err);
            }
            else if(dateInfo){
                req.dateInfo = dateInfo;
                next();
            }
            else{
                res.status(404).send('No date found');
            }
        });
    });

    dateInfoRouter.route('/:dateId')
        .get(function(req, res){
            var returnDate = req.dateInfo.toJSON();
            res.json(returnDate);
        })
        .put(function(req, res){
            req.dateInfo.date = req.body.date;
            req.dateInfo.productionHour = req.body.productionHour;
            req.dateInfo.goal = req.body.goal;
            req.dateInfo.workers = req.body.workers;
            req.dateInfo.minutesPerProduct = req.body.minutesPerProduct;
            req.dateInfo.planEfficiency = req.body.planEfficiency;
            req.dateInfo.planDHULevel = req.body.planDHULevel;
            req.dateInfo.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    io.emit('lineUpdated', {
                    });
                    res.json(req.dateInfo);
                }
            });
        })
        .patch(function(req, res){
            if(req.body._id){
                delete req.body._id;
            }

            for(var p in req.body){
                req.dateInfo[p] = req.dateInfo[p];
            }

            req.dateInfo.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.json(req.dateInfo);
                }
            });
        })
        .delete(function(req, res){
            req.dateInfo.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.status(204).send('Removed');
                }
            });
        });

    return dateInfoRouter;
};

module.exports = routes;