const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/UserRoutes');
const companyRoutes = require('./routes/companyRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const SavedjobsRoutes = require('./routes/savedJobsRoutes');
const appsRoutes = require('./routes/ApplicationRoutes');

app.use('/api/apps', appsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/jobs',jobsRoutes );
app.use('/api/saved',SavedjobsRoutes );

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
