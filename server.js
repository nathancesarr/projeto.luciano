const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const engine = require("ejs-mate"); // EJS-MATE

const authRoutes = require("./routes/auth");
const gerenteRoutes = require("./routes/gerente");
const produtoRoutes = require("./routes/produtos");

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: "supermercado123",
        resave: false,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use("/", authRoutes);
app.use("/", gerenteRoutes);
app.use("/", produtoRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
