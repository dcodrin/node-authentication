const passport = require('passport');
const UserModel = require('../models/user');
const config = require('../config');

//jwt strategy for route authentication
const JwtStrategy = require('passport-jwt').Strategy;
//local strategy for signins
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;


//Setup options for jwt strategies
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create local strategy

//Overwrite the default passport field that expects a username (we use email), password stays the same
const usernameField = 'email';
const localLogin = new LocalStrategy({usernameField}, (email, password, done) => {

    //Verify username and password

    UserModel.findOne({email}, (err, user) => {
        if(err) {
            return done(err);
        }

        if(!user) {
            return done(null, false);
        }

        user.comparePassword(password, (err, match) => {
            if(err) {
                return done(err);
            }
            if(!match) {
                return done(null, false);
            }
            //If match === true
            return done(null, user);
        });
    });
});

//Create jwt strategy

//payload is the decoded jwt token
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user ID in the payload exists in our database (We are encoding the user id)

    //If the id exists call done with the user

    UserModel.findById(payload.sub, (err, user) => {
        if (err) {
            return done(err, false);
        }

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});

//Tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);