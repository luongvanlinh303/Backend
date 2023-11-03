// index.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const guardRoutes = require('./routes/guardRoutes');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/guard', guardRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
