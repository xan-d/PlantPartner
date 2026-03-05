module.exports = function requireAuth(req, res, next) {
    if (!req.session || !req.session.userID) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};