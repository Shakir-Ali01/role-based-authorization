const express = require('express');
const app = express();
const router = require('./routes/routing');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.use('/', router);

app.listen(3000, () => {
    console.log("server running on port 3000");
})