import 'dotenv/config';
import app from './app.js';
import { connectDB } from './db/db.js';

const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB first, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
