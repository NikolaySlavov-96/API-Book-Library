const cors = require("../middleware/cors");
const session = require("../middleware/session");
const trimBody = require("../middleware/trimBody");

const whitelist = ['http://localhost:3030'];

module.exports = (app, express) => {
    app.use(express.static('public'));
    app.use(cors(whitelist));
    app.use(express.json());

    app.use(trimBody());
    app.use(session());
}