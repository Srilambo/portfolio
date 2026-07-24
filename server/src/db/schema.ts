import { Schema, model, Document, Model } from 'mongoose';

// ── Message ────────────────────────────────────────────────
export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name:    { type: String, required: true, maxlength: 100 },
    email:   { type: String, required: true },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    status:  { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export const Message: Model<IMessage> = model<IMessage>('Message', MessageSchema);

// ── Setting (key/value store) ─────────────────────────────
export interface ISetting extends Document {
  key: string;
  value: string;
}

const SettingSchema = new Schema<ISetting>({
  key:   { type: String, required: true, unique: true },
  value: { type: String, default: '' },
});

export const Setting: Model<ISetting> = model<ISetting>('Setting', SettingSchema);

// ── DataStore (projects, skills, experience as JSON blobs) ─
export interface IDataStore extends Document {
  key: string;
  value: string; // JSON stringified
}

const DataStoreSchema = new Schema<IDataStore>({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

export const DataStore: Model<IDataStore> = model<IDataStore>('DataStore', DataStoreSchema);

// ── Review ──────────────────────────────────────────────────
export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name:    { type: String, required: true, maxlength: 100 },
    email:   { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export const Review: Model<IReview> = model<IReview>('Review', ReviewSchema);

// ── WhatsAppClick (visitor engagement tracking) ────────────
export interface IWhatsAppClick extends Document {
  source: 'contact' | 'footer' | 'other'; // where on page the click happened
  page:   string;                          // current page URL path
  ip?:    string;                          // hashed/anonymised for privacy
  createdAt: Date;
}

const WhatsAppClickSchema = new Schema<IWhatsAppClick>(
  {
    source: { type: String, enum: ['contact', 'footer', 'other'], default: 'other' },
    page:   { type: String, default: '/' },
    ip:     { type: String, default: '' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export const WhatsAppClick: Model<IWhatsAppClick> = model<IWhatsAppClick>('WhatsAppClick', WhatsAppClickSchema);
