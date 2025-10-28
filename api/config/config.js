module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./sqlite/dev.sqlite"
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    dialect: "sqlite",
    storage: "./sqlite/prod.sqlite"
  }
};
