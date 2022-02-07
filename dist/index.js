"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5050; // default port to listen
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello word!");
});
// start the Express server
const start = () => {
    app.listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}`);
    });
};
start();
//# sourceMappingURL=index.js.map