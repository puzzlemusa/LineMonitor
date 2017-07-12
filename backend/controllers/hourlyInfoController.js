var hourlyInfoController = function(HourlyInfo, io){

    var post = function(req, res){
        var hourlyInfo = new HourlyInfo(req.body);

        if(!req.body.startHour){
            res.status(400);
            res.send('Start hour is required');
        }
        else{
            hourlyInfo.save();
            res.status(201);
            res.send(hourlyInfo);
            io.emit('hourUpdated', {
            });
        }
    };

    var get = function(req, res){

        var query = {};

        if(req.query.startHour){
            query.startHour = req.query.startHour;
        }

        var baseUri = req.baseUrl;
        var uriSegment = baseUri.toString().split('/');
        if(uriSegment) {
            query.lineId = uriSegment[3];
            query.dateId = uriSegment[5];
        }

        HourlyInfo.find(query, function(err, hourlyInfo){

            if(err){
                res.status(500).send(err);
            }
            else{
                var returnDateInfo = [];
                hourlyInfo.forEach(function(element, index, array){
                    var hourlyInfo = element.toJSON();
                    hourlyInfo.links={};
                    hourlyInfo.links.self = 'http://' + req.headers.host
                        + req.baseUrl + '/' + hourlyInfo._id;

                    returnDateInfo.push(hourlyInfo);
                });
                res.json(returnDateInfo);
            }
        });
    };

    return {
        post: post,
        get: get
    }
};

module.exports = hourlyInfoController;