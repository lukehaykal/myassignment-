const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config').development;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.storage,
  logging: false
});

// define models manually without CLI for simplicity
const User = require('./models/user')(sequelize, DataTypes);
const Output = require('./models/output')(sequelize, DataTypes);

(async () => {
  await sequelize.sync(); // use sequelize-cli migrations in production if preferred
})();

const app = express();
app.use(bodyParser.json());

// instrumentation example: simple timing middleware
app.use((req, res, next) => {
  req._startTime = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - req._startTime;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

// CRUD: Users
app.get('/api/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const u = await User.create(req.body);
  res.status(201).json(u);
});

app.patch('/api/users', async (req, res) => {
  const id = Number(req.query.id);
  const u = await User.findByPk(id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  await u.update(req.body);
  res.json(u);
});

app.delete('/api/users', async (req, res) => {
  const id = Number(req.query.id);
  await User.destroy({ where: { id } });
  res.json({ success: true });
});

// Save output
app.post('/api/outputs', async (req, res) => {
  const out = await Output.create(req.body);
  // Optionally: upload html to S3 here for Lambda consumption (see later)
  res.status(201).json(out);
});

app.get('/api/outputs', async (req, res) => {
  const list = await Output.findAll();
  res.json(list);
});

// instrumentation endpoint for metrics (simple)
app.get('/metrics', async (req, res) => {
  res.send(`# metrics\nrequests_total 1\n`); // placeholder, replace with real metrics
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API listening on', PORT));
module.exports = app; // export for supertest in tests
