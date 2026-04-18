export const validateBody = (schema) => {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
};
export const validateQuery = (schema) => {
    return (req, _res, next) => {
        req.query = schema.parse(req.query);
        next();
    };
};
