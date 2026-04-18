export const validateBody = (schema) => {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
};
export const validateQuery = (schema) => {
    return (req, _res, next) => {
        const parsed = schema.parse(req.query);
        // Express 5 may expose req.query via a getter; mutate existing object
        // instead of reassigning the property to avoid runtime TypeError.
        const target = req.query;
        for (const key of Object.keys(target)) {
            delete target[key];
        }
        Object.assign(target, parsed);
        next();
    };
};
