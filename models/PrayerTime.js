const mongoose = require('mongoose');

const prayerTimeSchema = new mongoose.Schema({
  madrasa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Madrasa',
    required: true,
  },
  date: {
    type: Date,
    
  },
  fajrTime: String,
  dhuhrTime: String,
  asrTime: String,
  maghribTime: String,
  ishaTime: String,
});

const PrayerTime = mongoose.model('PrayerTime', prayerTimeSchema);

module.exports = PrayerTime;
