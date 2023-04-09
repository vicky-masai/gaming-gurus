import { useState, useEffect, SyntheticEvent } from "react";
import { game } from "../game.mjs";
import Square from "./Square";
import Player from "./Player";
import { positionType } from "../types";
import axios from "axios";

// const game = new Game();

// below function should only be called after setState is registered
// const move = game.move;
// const selectPosition = game.selectPosition;
// const startGame = game.startGame;

// const state = {
// 	board,
// 	activePlayer,
// 	playerScore,
// 	winner,
// 	selectedPosition,
// 	possibleMovesForSelectedPosition,
// 	pastMoves,
// 	players
// };

export default function Checkers() {
	const [state, setState] = useState(game.getState());
	// iAm will change to "a" if no other user is there waiting to play, otherwise to "b"
	const [iAm, setIAm] = useState("");
	const [matchId, setMatchId] = useState("");

	useEffect(() => {
		game.registerSetState(setState);
	}, []);

	useEffect(() => {
		// check if any user is waiting to play, otherwise create new match
		game.addPlayer(`Player ${Math.ceil(Math.random() * 100)}`);
		createNewMatch();
		async function createNewMatch() {
			try {
				const body = game.getState();
				const response = await axios.post("http://localhost:3001/matches/new", body, {
					headers: {
						"content-type": "application/json"
					}
				});
				const match = response.data;
				setMatchId(match._id);
				if (match.players.b === "") {
					setIAm("a");
					console.log({ iAm, match });
				} else {
					setIAm("b");
					console.log({ iAm, match });
				}
			} catch (error: any) {
				console.log({ error: error.message });
			}
		}
	}, []);

	useEffect(() => {
		if (game.players.a === "" || game.players.b === "") {
			// if two oplayers are there, then only match can be updated and match._id also be available
			return;
		}

		updateMatch();

		async function updateMatch() {
			try {
				const body: any = game.getState();
				body._id = matchId;
				await axios.patch("http://localhost:3001/matches/update", body, {
					headers: {
						"content-type": "application/json"
					}
				});
			} catch (error: any) {
				console.log({ error: error.message });
			}
		}
	});

	useEffect(() => {
		if (!matchId) {
			return;
		}

		setInterval(update, 5000);

		async function update() {
			const response = await axios.get(`http://localhost:3001/matches/${matchId}`);
			const match = response.data;
			for (let key in match) {
				game[key] = match[key];
			}
			setState(game.getState());
		}
	}, [matchId]);

	if (game.winner !== "pending") {
		game.startGame();
		// return <h1>Winner ${game.winner}</h1>;
	}

	return (
		<>
			<Player
				name={iAm === "a" ? "Blake" : iAm === "b" ? "Allison" : "Player"}
				player={iAm === "a" ? "b" : "a"}
				score={game.playerScore[iAm === "a" ? "b" : "a"]}
				activePlayer={game.activePlayer}
			/>
			<div
				style={{
					width: "fit-content",
					height: "fit-content",
					border: "3px solid black",
					display: "grid",
					gridTemplateColumns: `repeat(${game.board.length}, 1fr)`,
					gridTemplateRows: `repeat(${game.board.length}, 1fr)`,
					margin: "30px auto"
				}}
			>
				{getSquares(game.board, game.selectedPosition, iAm)}
			</div>
			<Player
				name={iAm === "a" ? "Allision" : iAm === "b" ? "Blake" : "Player"}
				player={iAm}
				score={game.playerScore[iAm]}
				activePlayer={game.activePlayer}
			/>
		</>
	);
}

function getSquares(board: [[String]], selectedPosition: positionType, iAm: string) {
	const squares = [];

	const start = iAm === "a" ? 0 : board.length - 1;
	const end = iAm === "a" ? board.length : -1;
	const change = iAm === "a" ? 1 : -1;

	for (let r = start; r !== end; r += change) {
		for (let c = 0; c < board.length; c++) {
			squares.push(
				<Square
					key={JSON.stringify({ r, c })}
					position={{ r, c }}
					piece={board[r][c]}
					selectedPosition={selectedPosition}
					iAm={iAm}
				/>
			);
		}
	}
	return squares;
}
