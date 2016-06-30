const UserModel = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function createUserToken(user) {
    // 'sub' by convention refers to 'subject' and it points to the subject of the token
    // 'iat' by convention refers to 'issued at time' is the timestamp when the token was created
    const iat = new Date().getTime(),
        sub = user.id;
    return jwt.encode({sub, iat}, config.secret);
}


const signup = (req, res, next) => {

    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(422).send({error: 'You must provide email and password.'});
    }

    // See if a user with a given email exists

    UserModel.findOne({email}, (err, existingUser) => {
        if(err) {
            return next(err);
        }

        // If a an email already exists
        if(existingUser) {
            return res.status(422).send({error: 'Email is in use'});
        }

        //If no match found
        // Create user
        const newUser = new UserModel({email, password});
        //Save user
        newUser.save((err) => {
            if(err) {
                return next(err);
            }

            // Respond that user was created
            res.json({token: createUserToken(newUser)});
        });

    });
};

//We can access the user through req.user. Passport attaches the user to req for us.
const signin = (req, res, next) => {
    res.send({token: createUserToken(req.user)});
};

module.exports = {
    signup,
    signin
};