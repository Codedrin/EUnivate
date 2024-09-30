import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  availability: { type: String, enum: ['Available', 'Pending', 'NotAvailable'], default: 'Available' },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
