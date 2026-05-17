import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function test() {
  const maskedUri = MONGODB_URI?.replace(/:([^:@]{1,})@/, ':****@');
  console.log('Testing connection to:', maskedUri);
  
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in server/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000 
    });
    console.log('✅ Success: Connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error: Connection failed');
    console.error(err);
    process.exit(1);
  }
}

test();
