export const handleNonexistantEndpoint = (req, res) => {
    res.status(404).send({ msg: "Bad endpoint" });
};
export const errorPrinter = (err, req, res, next) => {
    if (err)
        console.log(err);
    next(err);
};
export const handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    else
        next(err);
};
export const handlePSQLThrownError = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" });
    }
    else if (err.code === "23502") {
        res.status(400).send({ msg: "Bad Request" });
    }
    else
        next(err);
};
export const handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};
