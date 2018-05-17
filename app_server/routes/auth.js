module.exports = {
    mustBeAuthenticated(req, res, next){
        req.isAuthenticated() ? next() : res.redirect('/users/login');
    },
    isAdmin(req, res, next){
        req.isAuthenticated() && req.user.isAdmin ? next() : res.redirect('/users');
    }
}