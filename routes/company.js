var formidable=require('formidable');
var path=require('path');
var fs =require('fs');
var User = require('../models/user');
var Company=require('../models/company');
var async = require('async');
var {arrayAverage} = require('../myFunctions');

module.exports=(router)=>{
 

  router.get('/create',function (req, res) {
  var success=req.flash('success')
    res.render('company/company',{title:'Company Reegistration||Rateme', user:req.user, success:success,noErrors:success.length>0});  
  });

  /* POST FOR CREATE A NEW COMPANY */
  router.post('/create', (req, res)=>{
      var newCompany=new Company();
      newCompany.name = req.body.name;
      newCompany.address = req.body.address;
      newCompany.city = req.body.city;
      newCompany.country = req.body.country;
      newCompany.sector = req.body.sector;
      newCompany.website = req.body.website;
      newCompany.image = req.body.upload;/* upload because the attribute name */
      newCompany.save((err)=>{
          if (err) {
              console.log(err);  
          }
          console.log(newCompany);
          
          req.flash('success', 'Company data has been added.');
          res.redirect('/company/create')
      })
  })
/* POST FOR UPLOAD IMAGE */
  router.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
        /* MY DIRECTORY */
    //form.uploadDir = path.join(__dirname, '../public/uploads');/* here save the file */
    form.on('fileBegin', (name, file) => {
        file.path = path.join(__dirname, `../public/uploads/${file.name}`);
    });
    /* now rename the file */
    form.on('file', (field, file) => {
       fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
           if(err){
               throw err
           }
           
           console.log('File has been renamed');
       }); 
    });
    
    form.on('error', (err) => {
        console.log('An error occured', err);
    });
    
    form.on('end', () => {
        console.log('File upload was successful');
    });
    
    form.parse(req);
    res.send();
});



/* END UPLOAD IMAGE */

router.get('/companies', (req, res) => {
    Company.find({}, (err, result) => {
        
        res.render('company/companies', {title: 'All Companies || RateMe', user: req.user, data: result});
    });
});

router.get('/company-profile/:id', (req, res) => {
    Company.findOne({'_id':req.params.id}, (err, data) => {
        var avg = arrayAverage(data.ratingNumber);
        console.log(avg);  
        res.render('company/company-profile', {title: 'Company Name'+ data.name, user:req.user, id: req.params.id, data:data, average: avg});
    });
});
router.get('/register-employee/:id', (req, res) => {
    Company.findOne({'_id':req.params.id}, (err, data) => {
        res.render('company/register-employee', {title: 'Register Employee', user:req.user, data: data});
    });
});
router.post('/register-employee/:id', (req, res, next) => {
    async.parallel([/* Parallel te permite hacer varias funciones en paralelo */
        function(callback){
           Company.update({
               '_id': req.params.id,
               'employees.employeeId': {$ne: req.user._id}
           },
           {
                $push: {employees: {employeeId: req.user._id, employeeFullname:req.user.fullname, employeeRole:req.body.role}}
           }, (err, count) => {
               if(err){
                   return next(err);
               }
               callback(err, count);
           });
        },
        
        function(callback){
            async.waterfall([
                function(callback){
                    Company.findOne({'_id': req.params.id}, (err, data) => {
                        callback(err, data);
                    })
                },
                
                function(data, callback){
                    User.findOne({'_id': req.user._id}, (err, result) => {
                        result.role = req.body.role;
                        result.company.name = data.name;
                        result.company.image = data.image;
                        
                        result.save((err) => {
                            res.redirect('/user/home');
                        });
                    });
                }
            ]);
        }
    ]);
});

router.get('/:name/employees', (req, res) => {
    Company.findOne({'name':req.params.name}, (err, data) => {
        res.render('company/employees', {title: 'Company EMployees', user: req.user, data: data});
    });
});

    
}