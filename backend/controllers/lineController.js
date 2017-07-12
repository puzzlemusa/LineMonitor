var lineController = function(Line, io){
    
    var post = function(req, res){
        var line = new Line(req.body);
        
        if(!req.body.lineName){
            res.status(400);
            res.send('Name is required');
        }
        else{
            line.save();
            res.status(201);
            res.send(line);
        }
    };

    var get = function(req, res){

        var query = {};

        if(req.query.lineType){
            query.lineType = req.query.lineType;
        }

        Line.find(query, function(err, lines){
            
            if(err){
                res.status(500).send(err);
            }
            else{

                var returnLines = [];
                lines.forEach(function(element, index, array){
                    var newLine = element.toJSON();
                    newLine.links={};
                    newLine.links.self = 'http://' + req.headers.host
                    + '/api/lines/' + newLine._id;

                    returnLines.push(newLine);
                });
                res.json(returnLines);
            }
        });
    };

    return {
        post: post,
        get: get
    }
};

module.exports = lineController;