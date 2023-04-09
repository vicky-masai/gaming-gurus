import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Chat from "./Chat";
import Checkers from "../components/Checkers";
// import Game from "./Game"

const Allroutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Homepage />} />
			<Route path="/chat" element={<Chat />} />
			<Route path="/checkers" element={<Checkers />} />

			{/* <Route path="/game" element={<Game />} /> */}
		</Routes>
	);
};

export default Allroutes;
