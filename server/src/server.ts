import 'dotenv/config';
import app from './app.js';
import { connectDB } from './db/db.js';

const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB
connectDB();

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
