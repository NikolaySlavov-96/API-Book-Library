const cors = require("../middleware/cors");
const session = require("../middleware/session");
const trimBody = require("../middleware/trimBody");

const whitelist = ['http://localhost:3000', 'http://localhost:3030', 'http://192.168.88/51'];

module.exports = (app, express) => {
    app.use(express.static('public'));
    app.use(cors(whitelist));
    app.use(express.json());

    app.use(trimBody());
    app.use(session());
}