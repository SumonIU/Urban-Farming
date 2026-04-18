export const openApiDocument = {
    openapi: "3.0.3",
    info: {
        title: "Urban Farming Platform API",
        version: "1.0.0",
        description: "Express.js + Prisma backend for urban farming, rentals, produce, forum, and plant tracking.",
    },
    servers: [{ url: "http://localhost:4000/api" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    paths: {
        "/health": {
            get: {
                summary: "Health check",
                responses: { "200": { description: "OK" } },
            },
        },
        "/auth/register": {
            post: {
                summary: "Register a user",
                responses: { "201": { description: "Created" } },
            },
        },
        "/auth/login": {
            post: {
                summary: "Login and get a token",
                responses: { "200": { description: "OK" } },
            },
        },
        "/produce": {
            get: { summary: "List produce" },
            post: { summary: "Create produce", security: [{ bearerAuth: [] }] },
        },
        "/rental-spaces": {
            get: { summary: "List rental spaces" },
            post: { summary: "Create rental space", security: [{ bearerAuth: [] }] },
        },
        "/orders": {
            get: { summary: "List orders", security: [{ bearerAuth: [] }] },
            post: { summary: "Create order", security: [{ bearerAuth: [] }] },
        },
        "/community-posts": {
            get: { summary: "List posts" },
            post: { summary: "Create post", security: [{ bearerAuth: [] }] },
        },
        "/plants": {
            get: { summary: "List tracked plants", security: [{ bearerAuth: [] }] },
            post: { summary: "Create tracked plant", security: [{ bearerAuth: [] }] },
        },
    },
};
