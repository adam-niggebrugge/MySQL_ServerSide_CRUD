const express = require('express');
const sequelize = require('./config/connection');
const Interface = require('./lib/interface');
const interface = new Interface();
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

//Start asking the user what they want to do.
interface.init();