// index.js
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const guardRoutes = require('./routes/guardRoutes');
const managerRoutes = require('./routes/managerRoutes');
var order = require('./routes/order');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true }),cors());
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJsdoc(options);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/guard', guardRoutes);
app.use('/manager', managerRoutes);
app.use('/order', order);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  require('child_process').exec('start http://localhost:3000/api-docs');
});