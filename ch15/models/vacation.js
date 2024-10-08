const mongoose = require('mongoose');

const vacationSchema = mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  sku: String,
  description: String,
  location: {
    search: String,
    coordinates: { lat: Number, lng: Number }
  },
  price: Number,
  tags: [String],
  inSeason: Boolean,
  available: Boolean,
  requiresWaiver: Boolean,
  maximumGuests: Number,
  notes: String,
  packagesSold: Number,
  deleteRequested: Boolean
});
vacationSchema.set('toObject', { getters: true, virtuals: true});
// this step will create a db named 'vacations'
const Vacation = mongoose.model("Vacation", vacationSchema);
module.exports = Vacation;