const config = require('config');
const Surreal = require("surrealdb.js").default;

const db = new Surreal(config.get('surreal.url'));

db.signin({
    user: config.get('surreal.user'),
    pass: config.get('surreal.pass'),
});

db.use(config.get('surreal.ns'), config.get('surreal.db'));

module.exports = db;