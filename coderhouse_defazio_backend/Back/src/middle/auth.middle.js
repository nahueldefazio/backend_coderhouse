const auth = (req, res, next) => {
    if (req.session.login) {
        req.session.touch()
        next();
    } else {
        return res.status(401).send('No Autorizado');
    }
}

export default auth;