import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://student:7kLATMKHMzLvt6Iu@cluster1.a8jw25c.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connection successful'))
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
