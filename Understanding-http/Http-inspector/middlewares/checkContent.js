export const checkcontent = (req, res, next) => {
    if (["PUT", "PATCH", "POST", "DELETE"].includes(req.method)) {
        if (!req.is("application/json")) {
            return res.status(415).json({
                success: false,
                message: "only json format supported"
            });
        }
    }
    next();
};