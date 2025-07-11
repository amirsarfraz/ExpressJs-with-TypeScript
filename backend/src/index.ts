import express from 'express';
import { AppDataSource } from './data-source';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error during Data Source initialization:', error);
  });
