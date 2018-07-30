'use strict';
exports.index = function (req, res) {
    if (req.session.cookie.originalMaxAge!==null) {
        res.redirect('/user/home');
    }else{

        res.render('index', {title:'Index || Rateme'});
    }


};

exports.setLocale = function (req, res) {
    res.cookie('locale', req.params.locale);
    res.redirect('/');
};
