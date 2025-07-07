const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;
const db = require('./model/');
const cors = require('cors');

var corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    optionsSuccessStatus: 200 
  };

app.use(express.static('public'));

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

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
  res.send('Hello Worlds!');
});