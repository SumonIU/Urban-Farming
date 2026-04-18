export const sendSuccess = (res, data, message = "Success", meta) => {
    return res.json({
        success: true,
        message,
        data,
        meta: meta ?? null,
        error: null,
    });
};
