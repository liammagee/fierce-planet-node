// Mongoose-auth
var mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , mongooseAuth = require('mongoose-auth');

// STEP 1: Schema Decoration and Configuration for the Routing
var UserSchema = new Schema({})
      , User;

UserSchema.plugin(mongooseAuth, {
    // Here, we attach your User model to every module
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    }

  , facebook: {
      everyauth: {
          myHostname: 'http://localhost:3000'
        , appId: '205901039456697'
        , appSecret: '65f0bc907d0b433343ef1e73b6cb8134'
        , redirectPath: '/'
      }
    }
      , password: {
            everyauth: {
                getLoginPath: '/login'
              , postLoginPath: '/login'
              , loginView: 'login.jade'
              , getRegisterPath: '/register'
              , postRegisterPath: '/register'
              , registerView: 'register.jade'
              , loginSuccessRedirect: '/'
              , registerSuccessRedirect: '/'
            }
        }
});
mongoose.model('User', UserSchema);
mongoose.connect('mongodb://heroku:e4ac2a0e4c20fe1d1e45d27c3e126186@staff.mongohq.com:10089/app708577');
//mongoose.connect('mongodb://localhost/test');
User = mongoose.model('User');
