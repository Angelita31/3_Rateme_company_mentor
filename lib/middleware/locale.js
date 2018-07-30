'use strict';
/* var acceptLanguage=require('accept-language'); */
module.exports = function () {
    return function (req, res, next) {
        var locale = req.cookies && req.cookies.locale;
        //Set the locality for this response. The template will pick the appropriate bundle
        
        res.locals.locale = locale;
        next();
    };
};

/* module.exports=function () {
    return function(req, res, next){
    var locale=acceptLanguage.parse(req.headers['accept-language']);
    res.locals.context={
        'locality':{ 'language':locale[0].language,
                    'country':locale[0].region}
    };
    
    
        next();
};
} */
