import express from 'express';
import path from 'path';

const app = express();

const publicPath = path.join(__dirname, 'public');
const avatarsPath = path.join(publicPath, 'avatars');

app.use(express.static(publicPath));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
