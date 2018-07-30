var Company=require('../models/company');
var async = require('async');
module.exports = function (router) {
  router.get('/:id', (req, res) =>  {   
    var messg = req.flash('success');
    Company.findOne({'_id':req.params.id}, (err, data) => {
        res.render('company/review', {title: 'Company Review', user:req.user, data:data, msg: messg, hasMsg: messg.length>0}); 
  });
});

/* HERE IS SAVING THE DATA REVIEW */
router.post('/:id', (req, res) => {
  async.waterfall([
      function(callback){
          Company.findOne({'_id':req.params.id}, (err, result) => {
              callback(err, result);
          });
      },
      
      function(result, callback){
          Company.update({
              '_id': req.params.id
          },
  
          {
              $push: {companyRating: {
                  companyName: req.body.sender,
                  userFullname: req.user.fullname,
                  userRole: req.user.role,
                  companyImage: req.user.company.image,
                  userRating: req.body.clickedValue,/* this value is in rating.js not in form */
                  userReview: req.body.review
              }, 
                  ratingNumber: req.body.clickedValue       
              },
              $inc: {ratingSum: req.body.clickedValue}
          }, (err) => {
              req.flash('success', 'Your review has been added.');
              res.redirect('/review/'+req.params.id)
          })
      }
  ])
});


}