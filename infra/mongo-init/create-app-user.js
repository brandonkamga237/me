// Runs once, on an empty data volume. The API connects as a user limited to its own database,
// so a leaked connection string cannot touch anything else on the server.
const name = process.env.MONGO_DB;
db.getSiblingDB(name).createUser({
  user: process.env.MONGO_APP_USER,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [{ role: "readWrite", db: name }],
});
