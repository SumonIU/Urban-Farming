const responseEnvelope = {
    type: "object",
    required: ["success", "message", "data", "meta", "error"],
    properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {},
        meta: { nullable: true },
        error: { nullable: true },
    },
};
const authResponse = {
    type: "object",
    properties: {
        user: {
            type: "object",
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                email: { type: "string", format: "email" },
                role: { type: "string", enum: ["ADMIN", "VENDOR", "CUSTOMER"] },
                status: { type: "string" },
            },
        },
        token: { type: "string" },
    },
};
const commonQueryParams = [
    { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
    {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100 },
    },
];
const successResponse = (description, schema, example) => ({
    description,
    content: {
        "application/json": {
            schema: {
                ...responseEnvelope,
                properties: {
                    ...responseEnvelope.properties,
                    data: schema,
                },
            },
            examples: {
                sample: {
                    value: {
                        success: true,
                        message: description,
                        data: example,
                        meta: null,
                        error: null,
                    },
                },
            },
        },
    },
});
const errorResponse = (status, message) => ({
    description: status,
    content: {
        "application/json": {
            schema: responseEnvelope,
            examples: {
                sample: {
                    value: {
                        success: false,
                        message,
                        data: null,
                        meta: null,
                        error: null,
                    },
                },
            },
        },
    },
});
export const openApiDocument = {
    openapi: "3.0.3",
    info: {
        title: "Urban Farming Platform API",
        version: "1.0.0",
        description: "Express.js + Prisma backend for urban farming, rentals, produce, forum, plant tracking, and sustainability verification.",
    },
    servers: [{ url: "http://localhost:4000/api" }],
    tags: [
        { name: "System" },
        { name: "Auth" },
        { name: "Vendors" },
        { name: "Produce" },
        { name: "Rentals" },
        { name: "Orders" },
        { name: "Community" },
        { name: "Plants" },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    role: { type: "string", enum: ["ADMIN", "VENDOR", "CUSTOMER"] },
                    status: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            VendorProfile: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    userId: { type: "string" },
                    farmName: { type: "string" },
                    farmLocation: { type: "string" },
                    certificationStatus: {
                        type: "string",
                        enum: ["PENDING", "VERIFIED", "REJECTED"],
                    },
                    isApproved: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            Produce: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    vendorId: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    category: { type: "string" },
                    certificationStatus: {
                        type: "string",
                        enum: ["PENDING", "VERIFIED", "REJECTED"],
                    },
                    availableQuantity: { type: "integer" },
                },
            },
            RentalSpace: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    vendorId: { type: "string" },
                    location: { type: "string" },
                    size: { type: "string" },
                    price: { type: "number" },
                    availability: {
                        type: "string",
                        enum: ["AVAILABLE", "RESERVED", "UNAVAILABLE"],
                    },
                },
            },
            Order: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    userId: { type: "string" },
                    produceId: { type: "string" },
                    vendorId: { type: "string" },
                    quantity: { type: "integer" },
                    status: {
                        type: "string",
                        enum: ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"],
                    },
                    orderDate: { type: "string", format: "date-time" },
                },
            },
            CommunityPost: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    userId: { type: "string" },
                    postContent: { type: "string" },
                    postDate: { type: "string", format: "date-time" },
                },
            },
            SustainabilityCert: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    vendorId: { type: "string" },
                    certifyingAgency: { type: "string" },
                    certificationDate: { type: "string", format: "date-time" },
                    documentUrl: { type: "string", nullable: true },
                    status: { type: "string", enum: ["PENDING", "VERIFIED", "REJECTED"] },
                },
            },
            Plant: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    userId: { type: "string" },
                    vendorId: { type: "string", nullable: true },
                    plantName: { type: "string" },
                    species: { type: "string" },
                    plantedAt: { type: "string", format: "date-time" },
                    expectedHarvest: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                    },
                    healthStatus: { type: "string", enum: ["GOOD", "WATCH", "CRITICAL"] },
                    growthStage: { type: "string" },
                },
            },
            PlantUpdate: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    plantId: { type: "string" },
                    note: { type: "string" },
                    healthStatus: { type: "string", enum: ["GOOD", "WATCH", "CRITICAL"] },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
        },
    },
    paths: {
        "/health": {
            get: {
                tags: ["System"],
                summary: "Health check",
                responses: {
                    200: successResponse("OK", { type: "object" }, { status: "healthy" }),
                },
            },
        },
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "email", "password"],
                                properties: {
                                    name: { type: "string", example: "Amina Rahman" },
                                    email: {
                                        type: "string",
                                        format: "email",
                                        example: "amina@example.com",
                                    },
                                    password: { type: "string", example: "Password123!" },
                                    role: {
                                        type: "string",
                                        enum: ["ADMIN", "VENDOR", "CUSTOMER"],
                                        example: "CUSTOMER",
                                    },
                                },
                            },
                            examples: {
                                customer: {
                                    value: {
                                        name: "Amina Rahman",
                                        email: "amina@example.com",
                                        password: "Password123!",
                                        role: "CUSTOMER",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("User registered", authResponse, {
                        user: {
                            id: "user_1",
                            name: "Amina Rahman",
                            email: "amina@example.com",
                            role: "CUSTOMER",
                            status: "ACTIVE",
                        },
                        token: "jwt-token",
                    }),
                    400: errorResponse("Bad Request", "Validation failed"),
                    409: errorResponse("Conflict", "Email is already registered"),
                },
            },
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login and receive a JWT",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    password: { type: "string" },
                                },
                            },
                            examples: {
                                admin: {
                                    value: {
                                        email: "admin@urbanfarm.local",
                                        password: "Password123!",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: successResponse("Login successful", authResponse, {
                        user: {
                            id: "user_1",
                            name: "Platform Admin",
                            email: "admin@urbanfarm.local",
                            role: "ADMIN",
                            status: "ACTIVE",
                        },
                        token: "jwt-token",
                    }),
                    400: errorResponse("Bad Request", "Validation failed"),
                    401: errorResponse("Unauthorized", "Invalid email or password"),
                },
            },
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current authenticated user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: successResponse("Current user fetched", { type: "object" }, { user: { id: "user_1" } }),
                    401: errorResponse("Unauthorized", "Authentication required"),
                },
            },
        },
        "/vendors": {
            get: {
                tags: ["Vendors"],
                summary: "List vendors",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: successResponse("Vendors fetched", { type: "object" }, { vendors: [{ id: "vendor_1", farmName: "Green Plot 1" }] }),
                },
            },
        },
        "/vendors/{id}/approve": {
            patch: {
                tags: ["Vendors"],
                summary: "Approve a vendor",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: successResponse("Vendor approved", { type: "object" }, { vendor: { id: "vendor_1", isApproved: true } }),
                    401: errorResponse("Unauthorized", "Authentication required"),
                    403: errorResponse("Forbidden", "Insufficient permissions"),
                },
            },
        },
        "/vendors/{vendorId}/certifications": {
            post: {
                tags: ["Vendors"],
                summary: "Submit sustainability certification",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "vendorId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["certifyingAgency", "certificationDate"],
                                properties: {
                                    certifyingAgency: { type: "string" },
                                    certificationDate: { type: "string", format: "date-time" },
                                    documentUrl: { type: "string", format: "uri" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Certification submitted", { type: "object" }, { cert: { id: "cert_1", status: "PENDING" } }),
                    400: errorResponse("Bad Request", "Validation failed"),
                    403: errorResponse("Forbidden", "Insufficient permissions"),
                },
            },
        },
        "/vendors/certifications/{id}/review": {
            patch: {
                tags: ["Vendors"],
                summary: "Review certification",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["status"],
                                properties: {
                                    status: { type: "string", enum: ["VERIFIED", "REJECTED"] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: successResponse("Certification updated", { type: "object" }, { cert: { id: "cert_1", status: "VERIFIED" } }),
                },
            },
        },
        "/produce": {
            get: {
                tags: ["Produce"],
                summary: "List produce with pagination",
                parameters: [
                    ...commonQueryParams,
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "vendorId", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    200: successResponse("Produce fetched", { type: "object" }, { items: [{ id: "produce_1", name: "Tomatoes" }] }),
                },
            },
            post: {
                tags: ["Produce"],
                summary: "Create produce",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: [
                                    "vendorId",
                                    "name",
                                    "description",
                                    "price",
                                    "category",
                                    "availableQuantity",
                                ],
                                properties: {
                                    vendorId: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    price: { type: "number" },
                                    category: { type: "string" },
                                    availableQuantity: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Produce created", { type: "object" }, { produce: { id: "produce_1", name: "Tomatoes" } }),
                },
            },
        },
        "/produce/{id}": {
            get: {
                tags: ["Produce"],
                summary: "Get produce details",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: successResponse("Produce fetched", { $ref: "#/components/schemas/Produce" }, { produce: { id: "produce_1", name: "Tomatoes" } }),
                    404: errorResponse("Not Found", "Produce not found"),
                },
            },
            patch: {
                tags: ["Produce"],
                summary: "Update produce",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: successResponse("Produce updated", { type: "object" }, { produce: { id: "produce_1", name: "Tomatoes" } }),
                },
            },
            delete: {
                tags: ["Produce"],
                summary: "Delete produce",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: successResponse("Produce deleted", { type: "null" }, null),
                },
            },
        },
        "/rental-spaces": {
            get: {
                tags: ["Rentals"],
                summary: "List rental spaces",
                parameters: [
                    ...commonQueryParams,
                    { name: "location", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    200: successResponse("Rental spaces fetched", { type: "object" }, { items: [{ id: "space_1", location: "Zone 1" }] }),
                },
            },
            post: {
                tags: ["Rentals"],
                summary: "Create rental space",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["vendorId", "location", "size", "price"],
                                properties: {
                                    vendorId: { type: "string" },
                                    location: { type: "string" },
                                    size: { type: "string" },
                                    price: { type: "number" },
                                    availability: {
                                        type: "string",
                                        enum: ["AVAILABLE", "RESERVED", "UNAVAILABLE"],
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Rental space created", { type: "object" }, { rentalSpace: { id: "space_1", location: "Zone 1" } }),
                },
            },
        },
        "/rental-spaces/{id}/book": {
            post: {
                tags: ["Rentals"],
                summary: "Book a rental space",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["startDate", "endDate"],
                                properties: {
                                    startDate: { type: "string", format: "date-time" },
                                    endDate: { type: "string", format: "date-time" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Rental space booked", { type: "object" }, { booking: { id: "booking_1", status: "PENDING" } }),
                },
            },
        },
        "/orders": {
            get: {
                tags: ["Orders"],
                summary: "List orders",
                security: [{ bearerAuth: [] }],
                parameters: commonQueryParams,
                responses: {
                    200: successResponse("Orders fetched", { type: "object" }, { items: [{ id: "order_1", status: "PAID" }] }),
                },
            },
            post: {
                tags: ["Orders"],
                summary: "Create order",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["produceId", "vendorId"],
                                properties: {
                                    produceId: { type: "string" },
                                    vendorId: { type: "string" },
                                    quantity: { type: "integer", default: 1 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Order created", { type: "object" }, { order: { id: "order_1", status: "PENDING" } }),
                },
            },
        },
        "/community-posts": {
            get: {
                tags: ["Community"],
                summary: "List community posts",
                parameters: commonQueryParams,
                responses: {
                    200: successResponse("Posts fetched", { type: "object" }, {
                        items: [
                            {
                                id: "post_1",
                                postContent: "Crop rotation improves soil health.",
                            },
                        ],
                    }),
                },
            },
            post: {
                tags: ["Community"],
                summary: "Create community post",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["postContent"],
                                properties: { postContent: { type: "string" } },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Post created", { type: "object" }, {
                        post: {
                            id: "post_1",
                            postContent: "Use compost tea for leafy greens.",
                        },
                    }),
                },
            },
        },
        "/plants": {
            get: {
                tags: ["Plants"],
                summary: "List tracked plants",
                security: [{ bearerAuth: [] }],
                parameters: commonQueryParams,
                responses: {
                    200: successResponse("Plants fetched", { type: "object" }, { plants: [{ id: "plant_1", plantName: "Tomato Patch" }] }),
                },
            },
            post: {
                tags: ["Plants"],
                summary: "Create tracked plant",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["plantName", "species"],
                                properties: {
                                    vendorId: { type: "string" },
                                    plantName: { type: "string" },
                                    species: { type: "string" },
                                    expectedHarvest: { type: "string", format: "date-time" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Plant tracked", { type: "object" }, { plant: { id: "plant_1", plantName: "Tomato Patch" } }),
                },
            },
        },
        "/plants/{id}/updates": {
            post: {
                tags: ["Plants"],
                summary: "Add plant health update",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["note"],
                                properties: {
                                    note: { type: "string" },
                                    healthStatus: {
                                        type: "string",
                                        enum: ["GOOD", "WATCH", "CRITICAL"],
                                        default: "GOOD",
                                    },
                                    growthStage: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: successResponse("Plant update added", { type: "object" }, {
                        update: { id: "update_1", note: "Leaves look healthy." },
                        plant: { id: "plant_1", healthStatus: "GOOD" },
                    }),
                },
            },
        },
    },
};
