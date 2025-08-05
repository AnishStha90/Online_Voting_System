const express = require('express');
require('dotenv').config();
require('./database/connection');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const userRoute = require('./routes/user')
const voteRoute = require('./routes/vote')
const partyRoute = require('./routes/party')
const electionRoute = require('./routes/election')
const authRoute = require('./routes/auth')
const userController = require('./controllers/userController');
const partyMemberRoutes = require('./routes/partyMemberRoutes');
const inquireRoutes = require("./routes/inquires");
const feedbackRoutes = require('./routes/feedback');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());
app.use(morgan('dev'));



// ✅ Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//routes
app.get('/verify/:token', userController.verifyEmail);
app.use('/api/users', userRoute);
app.use('/api/votes', voteRoute);
app.use('/api/parties', partyRoute);
app.use('/api/elections', electionRoute);
app.use('/api/auth', authRoute);
app.use('/api/partymembers', partyMemberRoutes);
app.use('/api/inquires', inquireRoutes)
app.use('/api/feedback', feedbackRoutes);

app.listen(port, () => {
    console.log(`App started successfully at port ${port}`);
});