const mongoose = require('mongoose');

// meaning: send an email to notice when an SKU in a list is "inSeason" again
const vacationInSeasonListenerSchema = mongoose.Schema({
  email: String,
  skus: [String]
});

const VacationInSeasonListener = mongoose.model("VacationInSeasonListener", vacationInSeasonListenerSchema);
module.exports = VacationInSeasonListener;