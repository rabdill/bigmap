var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var regionSchema = new Schema(
	{
		abbrev : { type: String, required: true, index: { unique: true } },
    full_name : { type: String, required: true, trim: true },
	  attackable : { type: Array },
	  control : { type: String, required: true, default: 'Govt'},
		strength : { type: Number, default: 1},
		latlong : { type: Array },
		labels : { type: Schema.Types.Mixed }
	}
);

module.exports = {
  Region: mongoose.model('region', regionSchema)
};
