const LocalStratergy = require("passport-local").Stratergy;
const bcrypt = require('bcrypt');

module.exports = function initialize(passport, getUserByEmail) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user found with that E-mail' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch {
            return done(e);
        }
    };

    passport.use(new LocalStratergy({ usernameField: 'email' }), authenticateUser)
    passport.serializeUser((user, done) => {});
    passport.deSerializeUser((id, done) => {});

};

// module.exports = initialize;