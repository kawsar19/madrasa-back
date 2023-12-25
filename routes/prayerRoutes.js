const express = require('express');
const router = express.Router();
const moment = require('moment');
const PrayerTime = require('../models/PrayerTime'); // Assuming your model is in a separate file

// Get prayer times for a specific Madrasa and today's date


// Calculate time until next prayer
function calculateTimeUntilNextPrayer(prayerTimes) {
  console.log(prayerTimes)
  const currentTime = moment().format('HH:mm');
  console.log(currentTime)
  let nextPrayer = '';
  const prayers = Object.entries(prayerTimes);

  for (let i = 0; i < prayers.length - 1; i++) {
    const [currentPrayer, currentTime] = prayers[i];
    const [nextPrayerName, nextPrayerTime] = prayers[i + 1];

    if (moment(currentTime, 'HH:mm').isBefore(moment()) && moment().isBefore(moment(nextPrayerTime, 'HH:mm'))) {
      const timeUntilNextPrayer = moment.duration(moment(nextPrayerTime, 'HH:mm').diff(moment()));
      return {
        nextPrayer: nextPrayerName,
        timeUntilNextPrayer: {
          hours: timeUntilNextPrayer.hours(),
          minutes: timeUntilNextPrayer.minutes(),
        },
      };
    }
  }

  // If the current time is after all prayer times, find the time until the next day's Fajr
  const nextFajrTime = moment(prayerTimes.fajrTime, 'HH:mm').add(1, 'days').format('HH:mm');
  const timeUntilNextFajr = moment.duration(moment(nextFajrTime, 'HH:mm').diff(moment()));

  return {
    nextPrayer: 'Fajr',
    timeUntilNextPrayer: {
      hours: timeUntilNextFajr.hours(),
      minutes: timeUntilNextFajr.minutes(),
    },
  };
}





// Get time until next prayer for a specific Madrasa
router.get('/:madrasaId/next-prayer', async (req, res) => {
  try {
    const { madrasaId } = req.params;
    const prayerTimes = await PrayerTime.findOne({ madrasa: madrasaId });

    if (!prayerTimes) {
      return res.status(404).json({ message: 'Prayer times not found for today.' });
    }

    const timeUntilNextPrayer = calculateTimeUntilNextPrayer(prayerTimes);

    res.json(timeUntilNextPrayer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate time until next prayer.', error: err.message });
  }
});

// Add new prayer times for a specific Madrasa and date
router.post('/:madrasaId/prayer-times', async (req, res) => {
  try {
    const { madrasaId } = req.params;
    const { fajrTime, dhuhrTime, asrTime, maghribTime, ishaTime } = req.body;

    // Check if prayer times exist for the given Madrasa
    const existingPrayerTimes = await PrayerTime.findOne({ madrasa: madrasaId });

    if (existingPrayerTimes) {
      // Update existing prayer times
      existingPrayerTimes.fajrTime = fajrTime;
      existingPrayerTimes.dhuhrTime = dhuhrTime;
      existingPrayerTimes.asrTime = asrTime;
      existingPrayerTimes.maghribTime = maghribTime;
      existingPrayerTimes.ishaTime = ishaTime;

      const updatedPrayerTimes = await existingPrayerTimes.save();
      res.json(updatedPrayerTimes);
    } else {
      // Create new prayer times
      const prayerTime = new PrayerTime({
        madrasa: madrasaId,
        fajrTime,
        dhuhrTime,
        asrTime,
        maghribTime,
        ishaTime,
      });

      const savedPrayerTime = await prayerTime.save();
      res.status(201).json(savedPrayerTime);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to add or update prayer times.', error: err.message });
  }
});
router.get('/:madrasaId/prayer-times', async (req, res) => {
  try {
    const { madrasaId } = req.params;

    // Check if prayer times exist for the given Madrasa
    const existingPrayerTimes = await PrayerTime.findOne({ madrasa: madrasaId });

    if (existingPrayerTimes) {
      res.json(existingPrayerTimes);
    } else {
      res.status(404).json({ message: 'Prayer times not found for this Madrasa.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to get prayer times.', error: err.message });
  }
});



// Update prayer times for a specific Madrasa and date


module.exports = router;
