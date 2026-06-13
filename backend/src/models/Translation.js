import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sourceLanguage: {
      type: String,
      required: true,
      trim: true
    },
    targetLanguage: {
      type: String,
      required: true,
      trim: true
    },
    detectedLanguage: {
      type: String,
      default: ''
    },
    originalText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    translatedText: {
      type: String,
      required: true,
      trim: true
    },
    favorite: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

translationSchema.index({ originalText: 'text', translatedText: 'text' });

export default mongoose.model('Translation', translationSchema);
