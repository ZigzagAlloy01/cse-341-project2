const express = require('express')
const bodyParser = require('body-parser')
const mongodb = require('./data/database')
const passport = require('passport')
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()

app
    .use(cors())
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
        )
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        next()
    })
    .use('/', require('./routes'))

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, done) {
            return done(null, profile)
        }
    ))
    
    passport.serializeUser((user, done) => {
        console.log("Serializing user:", user);
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        console.log("Deserializing user ID:", user); 
        done(null, { user });
    });

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")})

app.get("/github/callback", passport.authenticate('github', {
    failureRedirect: '/api-docs'
}), (req, res) => {
    req.session.user = req.user
    console.log("Setting req.session.user:", req.user)
    req.session.save((err) => { 
        if (err) console.error("Error saving session:", err)
        res.redirect('/')
    })
})

mongodb.initDb((err) => {
    if(err) {
        console.log(err)
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node running on ${port}`)})
    }
})