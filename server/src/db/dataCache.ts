import { Setting, DataStore, Review } from './schema.js';
import { connectDB } from './db.js';

interface CacheStore {
  dataStore: Map<string, any>;
  settings: Record<string, string> | null;
  publicData: any | null;
  reviews: any[] | null;
  lastWarmTime: number;
}

const cache: CacheStore = {
  dataStore: new Map(),
  settings: null,
  publicData: null,
  reviews: null,
  lastWarmTime: 0,
};

// Warm up cache in background
export async function warmCache(): Promise<void> {
  try {
    await connectDB();
    const [settingsRows, dataDocs, reviews] = await Promise.all([
      Setting.find().lean(),
      DataStore.find({ key: { $in: ['projects', 'skills', 'experience', 'blogs', 'services'] } }).lean(),
      Review.find({ approved: true }).sort({ createdAt: -1 }).lean(),
    ]);

    const settingsObj: Record<string, string> = {};
    for (const r of settingsRows) {
      settingsObj[r.key] = r.value;
    }
    cache.settings = settingsObj;
    cache.reviews = reviews;

    for (const doc of dataDocs) {
      try {
        cache.dataStore.set(doc.key, doc.value ? JSON.parse(doc.value) : []);
      } catch {
        cache.dataStore.set(doc.key, []);
      }
    }

    cache.publicData = {
      settings: cache.settings,
      projects: cache.dataStore.get('projects') ?? [],
      skills: cache.dataStore.get('skills') ?? [],
      experience: cache.dataStore.get('experience') ?? [],
      blogs: cache.dataStore.get('blogs') ?? [],
      services: cache.dataStore.get('services') ?? [],
      reviews: cache.reviews ?? [],
    };

    cache.lastWarmTime = Date.now();
  } catch (err) {
    console.error('Failed to pre-warm cache:', err);
  }
}

// Invalidate public combined data
export function invalidatePublicCache(): void {
  cache.publicData = null;
}

// Get single DataStore item
export async function getCachedDataStore(key: string): Promise<any> {
  if (cache.dataStore.has(key)) {
    return cache.dataStore.get(key);
  }
  await connectDB();
  const doc = await DataStore.findOne({ key }).lean();
  let val: any = null;
  if (doc?.value) {
    try {
      val = JSON.parse(doc.value);
    } catch {
      val = [];
    }
  }
  cache.dataStore.set(key, val);
  return val;
}

// Set single DataStore item with instant memory update
export async function setCachedDataStore(key: string, value: any): Promise<void> {
  cache.dataStore.set(key, value);
  invalidatePublicCache();
  await connectDB();
  await DataStore.findOneAndUpdate(
    { key },
    { key, value: JSON.stringify(value) },
    { upsert: true, new: true }
  );
}

// Get Settings
export async function getCachedSettings(): Promise<Record<string, string>> {
  if (cache.settings) {
    return cache.settings;
  }
  await connectDB();
  const rows = await Setting.find().lean();
  const obj: Record<string, string> = {};
  for (const r of rows) {
    obj[r.key] = r.value;
  }
  cache.settings = obj;
  return obj;
}

// Set Settings
export async function setCachedSettings(entries: [string, string][]): Promise<void> {
  if (!cache.settings) cache.settings = {};
  for (const [k, v] of entries) {
    cache.settings[k] = String(v);
  }
  invalidatePublicCache();
  await connectDB();
  await Promise.all(
    entries.map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { key, value: String(value) },
        { upsert: true, new: true }
      )
    )
  );
}

// Get complete Public Data
export async function getCachedPublicData(): Promise<any> {
  if (cache.publicData) {
    return cache.publicData;
  }

  await connectDB();
  const [settingsRows, dataDocs, reviews] = await Promise.all([
    Setting.find().lean(),
    DataStore.find({ key: { $in: ['projects', 'skills', 'experience', 'blogs', 'services'] } }).lean(),
    Review.find({ approved: true }).sort({ createdAt: -1 }).lean(),
  ]);

  const settingsObj: Record<string, string> = {};
  for (const r of settingsRows) {
    settingsObj[r.key] = r.value;
  }
  cache.settings = settingsObj;
  cache.reviews = reviews;

  for (const doc of dataDocs) {
    try {
      cache.dataStore.set(doc.key, doc.value ? JSON.parse(doc.value) : []);
    } catch {
      cache.dataStore.set(doc.key, []);
    }
  }

  cache.publicData = {
    settings: cache.settings,
    projects: cache.dataStore.get('projects') ?? [],
    skills: cache.dataStore.get('skills') ?? [],
    experience: cache.dataStore.get('experience') ?? [],
    blogs: cache.dataStore.get('blogs') ?? [],
    services: cache.dataStore.get('services') ?? [],
    reviews: cache.reviews ?? [],
  };

  return cache.publicData;
}
