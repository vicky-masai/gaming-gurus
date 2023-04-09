const mongoose = require("mongoose");

// 10 fields vs 7 fields

// const doc = {
// 	_id: { $oid: "6431cccf80efbec113b00d06" },
// 	board: [
// 		[" ", "b", " ", "b", " ", "b", " ", "b"],
// 		["b", " ", "b", " ", "b", " ", "b", " "],
// 		[" ", "b", " ", "b", " ", "b", " ", "b"],
// 		[" ", " ", " ", " ", " ", " ", " ", " "],
// 		[" ", " ", " ", " ", " ", " ", " ", " "],
// 		["a", " ", "a", " ", "a", " ", "a", " "],
// 		[" ", "a", " ", "a", " ", "a", " ", "a"],
// 		["a", " ", "a", " ", "a", " ", "a", " "]
// 	],
// 	activePlayer: "a",
// 	playerScore: { a: { $numberInt: "0" }, b: { $numberInt: "0" } },
// 	winner: "pending",
// 	possibleMovesForSelectedPosition: [],
// 	pastMoves: [],
// 	players: { a: "harry", b: "potter" }
// };

const matchSchema = new mongoose.Schema(
	{
		size: Number,
		homeRows: Number,
		board: [[String]],
		activePlayer: String,
		playerScore: { a: Number, b: Number },
		winner: String,
		// selectedPosition: { r: Number, c: Number },
		// possibleMovesForSelectedPosition: [{ r: Number, c: Number }],
		pastMoves: [{ from: { r: Number, c: Number }, to: { r: Number, c: Number } }],
		players: { a: String, b: String }
	},
	{
		versionKey: false
	}
);

const MatchModel = mongoose.model("match", matchSchema);

module.exports = MatchModel;
