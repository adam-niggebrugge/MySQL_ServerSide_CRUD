const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const interface = require('./lib/interface');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

//Start asking the user what they want to do.
interface.prompt();