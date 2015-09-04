var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var unitSchema = new Schema(
	{
    experience : { type: Number, default: 0 },
	  available : { type: Boolean, default: true },
	  knowledge : { type: Schema.Types.Mixed },
		location : { type: String, required: true }
	}
);

module.exports = {
  Unit: mongoose.model('unit', unitSchema)
};
