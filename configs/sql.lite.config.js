function configDatabase(nameDB) {
  const FactoryDatabase = require("better-sqlite3");
  const database = new FactoryDatabase(nameDB);

  return database;
}

module.exports = { configDatabase };
