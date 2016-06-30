const Authentication = require(('./controllers/authentication'));
const passportService = require('./services/passport');
const passport = require('passport');

//Create passport middleware, set the session to false as by default jwt will try to create a cookie
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function(app) {
    app.get('/', requireAuth, (req, res) => {
       res.send('YOU IN!');
    });
    app.post('/signin', requireSignIn, Authentication.signin);
    app.post('/signup', Authentication.signup);
};