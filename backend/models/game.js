var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var gameSchema = new Schema(
	{
		current_player : { type: String, required: true }
	}
);

module.exports = {
  Game: mongoose.model('game', gameSchema)
};
