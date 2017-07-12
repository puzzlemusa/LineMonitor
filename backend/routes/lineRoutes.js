var express = require('express');

//var routes = function(Line, io){
var routes = function(Line, io){
    var lineRouter = express.Router();

    var lineController = require('../controllers/lineController')(Line, io);

    lineRouter.route('/')
        .post(lineController.post)
        .get(lineController.get);

    lineRouter.use('/:lineId', function(req, res, next){
        Line.findById(req.params.lineId, function(err, line){
            if(err){
                res.status(500).send(err);
            }
            else if(line){
                req.line = line;
                next();
            }
            else{
                res.status(404).send('No production line found');
            }
        });
    });

    lineRouter.route('/:lineId')
        .get(function(req, res){
            //io.emit('productionLineUpdated', { item: req.productionLine.toJSON });
            var returnLine = req.line.toJSON();
            res.json(returnLine);
        })
        .put(function(req, res){
            req.line.lineName = req.body.lineName;
            req.line.lineType = req.body.lineType;
            req.line.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    io.emit('lineUpdated', {
                    });
                    res.json(req.line);
                }
            });
        })
        .patch(function(req, res){
            if(req.body._id){
                delete req.body._id;
            }

            for(var p in req.body){
                req.line[p] = req.body[p];
            }

            req.line.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.json(req.line);
                }
            });
        })
        .delete(function(req, res){
            req.line.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.status(204).send('Removed');
                }
            });
        });

    return lineRouter;
};

module.exports = routes;