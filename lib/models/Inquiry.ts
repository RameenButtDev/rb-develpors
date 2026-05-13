import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IInquiry extends Document {
  _id: mongoose.Types.ObjectId
  property?: mongoose.Types.ObjectId
  name: string
  email: string
  phone: string
  message: string
  inquiryType: 'general' | 'property' | 'viewing'
  status: 'new' | 'contacted' | 'closed'
  createdAt: Date
}

const inquirySchema = new Schema<IInquiry>({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone cannot exceed 20 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  inquiryType: {
    type: String,
    enum: ['general', 'property', 'viewing'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for admin queries
inquirySchema.index({ status: 1, createdAt: -1 })

const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', inquirySchema)

export default Inquiry
