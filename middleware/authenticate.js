const IsAuthenticated = (req, res, next) => {
    console.log("Running IsAuthenticated middleware");
    console.log("Session data:", req.session);
    if (req.session.user === undefined) {
        return res.status(401).json("You do not have access");
    }
    next();
};

module.exports = {
    IsAuthenticated
};
