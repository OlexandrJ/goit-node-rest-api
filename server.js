import express from 'express';
import path from 'path';
import { verifyUser } from './controllers/usersControllers.js';

const app = express();

const publicPath = path.join(__dirname, 'public');
const avatarsPath = path.join(publicPath, 'avatars');

app.use(express.static(publicPath));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/api/users/verify/:verificationToken', verifyUser);
