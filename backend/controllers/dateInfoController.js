var dateInfoController = function(DateInfo, io){

    var post = function(req, res) {
        var dateInfo = new DateInfo(req.body);

        if(!req.body.date){
            //res.status(400);
            //res.send('Date is required');
        }
        else{
            dateInfo.save();
            res.status(201);
            res.send(dateInfo);
            io.emit('hourUpdated', {
            });
        }
    };

    var get = function(req, res){

        var query = {};

        var baseUri = req.baseUrl;
        var uriSegment = baseUri.toString().split('/');
        if(uriSegment) {
            query.lineId = uriSegment[3];
        }

        DateInfo.find(query, function(err, dateInfo){

            if(err){
                res.status(500).send(err);
            }
            else{
                var returnDateInfo = [];
                dateInfo.forEach(function(element, index, array){
                    var dateInfo = element.toJSON();
                    dateInfo.links={};
                    dateInfo.links.self = 'http://' + req.headers.host
                        + req.baseUrl + '/' + dateInfo._id;

                    if(req.query.date) {
                        var passedDate = new Date(req.query.date);
                        var dateInfoDate = new Date(dateInfo.date);
                        if(passedDate.getDate() == dateInfoDate.getDate()) {
                            returnDateInfo.push(dateInfo);
                        }
                    }else {
                        returnDateInfo.push(dateInfo);
                    }
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

module.exports = dateInfoController;