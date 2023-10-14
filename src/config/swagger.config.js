export default {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "HabiTrack Server API",
      version: "2.0.0",
      description: "The API documentation for the HabiTrack server",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
      contact: {
        name: "HabiTrack",
        url: "https://github.com/bahricanyesil",
        email: "habiTrack.support@gmail.com",
      },
    },
    basePath: "/api",
    servers: [
      {
        url: "http://localhost:3000/api/",
      },
    ],
  },
  tags: [
    {
      name: "User",
      description: "API for users",
    },
  ],
  apis: [
    "src/models/*.js",
    "src/utils/helpers/*.js",
    "src/api/controllers/user/*.js",
    "src/api/controllers/user/edit/*.js",
    "src/api/controllers/user/auth/*.js",
  ],
};
