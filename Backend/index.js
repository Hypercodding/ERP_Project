require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const routes = require("./routes")

const app = express();

app.use(cors());
app.use(bodyParser.json());

routes(app)

// Connect to the database and start the server
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
