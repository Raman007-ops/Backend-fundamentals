

export const notfound = (req, res, next) => {
    if(req.url !== "/"  && req.url !== "/health" ) {
        return res.status(404).json({
            success : false,
            message : "no route exists"
        })
    }
    next();
}