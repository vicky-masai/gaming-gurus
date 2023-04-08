import { useState, useEffect, SyntheticEvent } from "react";
import { game } from "../game.mjs";
import Square from "./Square";
import Player from "./Player";
import { positionType } from "../types";

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

	useEffect(() => {
		game.registerSetState(setState);
	}, []);

	// iAm will change to "a" if no other user is there waiting to play, otherwise to "b"
	let iAm = null;

	// if ("r%2==c%2") {
	// 	const bg = "red";
	// } else {
	// 	const bg = "white";
	// }

	useEffect(() => {
		// game.selectPosition({ r: 5, c: 0 });
		// game.move({ r: 5, c: 0 }, { r: 3, c: 2 });
	}, []);

	if (game.winner !== "pending") {
		game.startGame();
		// return <h1>Winner ${game.winner}</h1>;
	}

	return (
		<>
			<Player
				name="Bicky"
				player={"b"}
				score={game.playerScore.b}
				activePlayer={game.activePlayer}
			/>
			<div
				style={{
					width: "fit-content",
					height: "fit-content",
					border: "1px solid black",
					display: "grid",
					gridTemplateColumns: `repeat(${game.board.length}, 1fr)`,
					gridTemplateRows: `repeat(${game.board.length}, 1fr)`,
					margin: "30px auto",
					gap: "3px"
				}}
			>
				{getSquares(game.board, game.selectedPosition)}
			</div>
			<Player
				name="Abhishek"
				player={"a"}
				score={game.playerScore.a}
				activePlayer={game.activePlayer}
			/>
		</>
	);
}

function getSquares(board: [[String]], selectedPosition: positionType) {
	const squares = [];
	for (let r = 0; r < board.length; r++) {
		for (let c = 0; c < board.length; c++) {
			squares.push(
				<Square
					key={JSON.stringify({ r, c })}
					position={{ r, c }}
					piece={board[r][c]}
					selectedPosition={selectedPosition}
				/>
			);
		}
	}
	return squares;
}
