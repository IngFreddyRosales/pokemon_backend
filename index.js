const express = require('express');
const bodyParser = require('body-parser');
const app = express();
port = 3000;
const db = require('./model/')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({
  // force: false, // Set to true to drop and recreate tables
}).then(() => {
  console.log('Database synchronized successfully.');
});

require('./routes')(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(express.static('public'));
app.use('/static', express.static('public'));
