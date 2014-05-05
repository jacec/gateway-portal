var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , express = require('express')
  , app = express();

//setup ejs for HTML views
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//local authentication function (using passport)
function auth(successRoute, failureRoute) {
	return passport.authenticate('local', { successRedirect: successRoute,
                                                    failureRedirect: failureRoute });
}

//Set passport to a local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);

//GET Default route! (if not authenticated route to login)
app.get('/', auth('/', 'login'), function(req, res){
  res.send('hello world');
});

//GET Login route
app.get('/login', function (req, res)
{
    res.render('login.html');
});

//GET About route
app.get('/about', function (req, res)
{
    res.render('about.html');
});

app.listen(3000);