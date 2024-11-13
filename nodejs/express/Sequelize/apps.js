const Sequelize = require("sequelize");
const express = require("express");



const app = express();
const urlencodedParser = express.urlencoded({ extended: false });

// определяем объект Sequelize
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "links_url.db",
    define: {
        timestamps: false
    }
});

// определяем модель Links
const Links = sequelize.define("links", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    info: {
        type: Sequelize.STRING,
        allowNull: false
    },
    regdate: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

app.set("view engine", "hbs");

// синхронизация с бд, после успшной синхронизации запускаем сервер
sequelize.sync().then(() => {
    app.listen(3000, function() {
        console.log("Сервер ожидает подключения на :3000 port...");
    });
}).catch(err => console.log(err));

// получение данных
app.get("/", function(req, res) {
    Links.findAll({ raw: true }).then(data => {
        res.render("index.hbs", {
            links: data
        });
    }).catch(err => console.log(err));
});

app.get("/create", function(req, res) {
    res.render("create.hbs");
});

// добавление данных
app.post("/create", urlencodedParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);
    const urldate = req.body.regdate;
    const urlname = req.body.url;
    const urlinfo = req.body.info;
    Links.create({ url: urlname, info: urlinfo, regdate: urldate }).then(() => {
        res.redirect("/");
    }).catch(err => console.log(err));
});

// получаем объект по id для редактирования
app.get("/edit/:id", function(req, res) {
    const urlid = req.params.id;
    Links.findAll({ where: { id: urlid }, raw: true })
        .then(data => {
            res.render("edit.hbs", {
                links: data[0]
            });
        })
        .catch(err => console.log(err));
});

// обновление данных в БД
app.post("/edit", urlencodedParser, function(req, res) {

    if (!req.body) return res.sendStatus(400);

    const urlname = req.body.url;
    const urlinfo = req.body.info;
    const urldate = req.body.regdate;
    const urlid = req.body.id;
    Links.update({ url: urlname, info: urlinfo, regdate: urldate }, { where: { id: urlid } }).then(() => {
            res.redirect("/");
        })
        .catch(err => console.log(err));
});

// удаление данных
app.post("/delete/:id", function(req, res) {
    const urlid = req.params.id;
    Links.destroy({ where: { id: urlid } }).then(() => {
        res.redirect("/");
    }).catch(err => console.log(err));
});