const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Clients Api",
        description: "Clients Api"
    },
    host: "localhost:3000",
    schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointFiles, doc);