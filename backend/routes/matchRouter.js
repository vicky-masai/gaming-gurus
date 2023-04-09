const express = require("express");
const MatchModel = require("../models/MatchModel");

const matchRouter = express.Router();

matchRouter.get("/", async (req, res) => {
	try {
		const matches = await MatchModel.find({});
		res.status(200).send(matches);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

matchRouter.get("/:_id", async (req, res) => {
	try {
		const { _id } = req.params;
		const matche = await MatchModel.findById({ _id });
		res.status(200).send(matche);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

matchRouter.post("/new", async (req, res) => {
	try {
		const matches = await MatchModel.find({});
		for (let matchDoc of matches) {
			if (matchDoc.players.b === "") {
				matchDoc.players.b = "b";
				matchDoc.isNew = false;
				matchDoc = await matchDoc.save();
				res.status(201).send(matchDoc);
				return;
			}
		}
		const match = req.body;
		let matchDoc = new MatchModel(match);
		matchDoc.players.a = "a";
		matchDoc.isNew = true;
		matchDoc = await matchDoc.save();
		res.status(200).send(matchDoc);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

matchRouter.patch("/update", async (req, res) => {
	try {
		let matchDoc = req.body;
		matchDoc = await MatchModel.findByIdAndUpdate({ _id: matchDoc._id }, matchDoc, {
			new: true
		});
		res.status(201).send(matchDoc);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = matchRouter;
