const express = require('express');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const projectRouter = require('./routes/projectRoute');
const moduleRouter = require('./routes/moduleRoute');
const activityRouter = require('./routes/activityRoute');
const forumRouter = require('./routes/forumRoute');
const cors = require('cors');
const mongoSanitise = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const app = express();

app.use(express.json());

// Data sanitisation against NoSQL query injection
app.use(mongoSanitise());

// Data sanitisation against
app.use(xss());

// Prevent parameter pollution, currently not whitelisting anything
app.use(hpp({ whitelist: [] }));

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(cors());

app.use('/users', userRouter);
app.use('/projects', projectRouter);
app.use('/modules', moduleRouter);
app.use('/activity', activityRouter);
// app.use('/forums', forumRouter);
// TODO: Implement global error handler here
//app.use(globalErrorHandler);

module.exports = app;
