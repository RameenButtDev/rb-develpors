import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProperty extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  slug: string
  description: string
  price: number
  location: {
    address: string
    city: string
    state: string
    country: string
  }
  images: string[]
  status: 'active' | 'completed' | 'upcoming'
  propertyType: 'residential' | 'commercial' | 'mixed-use'
  specs: {
    bedrooms?: number
    bathrooms?: number
    area: number
    yearBuilt?: number
    floors?: number
    units?: number
  }
  amenities: string[]
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'USA' },
    },
    images: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['active', 'completed', 'upcoming'],
      default: 'active',
    },
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'mixed-use'],
      default: 'residential',
    },
    specs: {
      bedrooms: { type: Number, min: 0 },
      bathrooms: { type: Number, min: 0 },
      area: { type: Number, required: true, min: 0 },
      yearBuilt: { type: Number },
      floors: { type: Number, min: 1 },
      units: { type: Number, min: 1 },
    },
    amenities: [{
      type: String,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Generate slug before saving
propertySchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

// Create indexes for common queries
propertySchema.index({ status: 1, featured: -1 })
propertySchema.index({ slug: 1 })
propertySchema.index({ 'location.city': 1 })

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema)

export default Property
