// game states: board, activePlayer, playerScore, winner, selectedPosition, possibleMovesForSelectedPosition, pastMoves
// game actions: movePiece, selectPosition		~expose these actions
// player side: a, b

// const args = process.argv;

// size;
// homeRows;
// board;
// activePlayer;
// playerScore;
// winner;
// selectedPosition;
// possibleMovesForSelectedPosition;
// pastMoves;
// players;

export default class Game {
	size;
	homeRows;
	// below are states
	board;
	activePlayer;
	playerScore;
	winner;
	selectedPosition;
	possibleMovesForSelectedPosition;
	pastMoves;
	players;

	setState;

	// position = {r, c}

	// change piece from letter to {player: "a" | "b", type: "plain" | "king"}

	// a = Player A
	// A = King of Player A
	// b = Player B
	// B = King of Player B

	constructor() {
		this.startGame();
	}

	startGame() {
		this.size = 8;
		this.board = [];
		this.homeRows = 3;
		this.activePlayer = "a";
		this.playerScore = { a: 0, b: 0 };
		this.winner = "pending";
		this.selectedPosition = null;
		this.possibleMovesForSelectedPosition = [];
		this.pastMoves = [];
		this.players = { a: "", b: "" };
		// this.players = { a: "a", b: "b" };
		// this.setState = null;

		for (let r = 0; r < this.size; r++) {
			let row = new Array(this.size).fill(" ");
			this.board.push(row);
		}
		for (let r = 0; r < this.homeRows; r++) {
			let start = r % 2 === 0 ? 1 : 0;
			for (let c = start; c < this.size; c += 2) {
				this.board[r][c] = "b";
			}
		}
		for (let r = this.size - 1; r > this.size - this.homeRows - 1; r--) {
			let start = (this.size - r) % 2 === 0 ? 1 : 0;
			for (let c = start; c < this.size; c += 2) {
				this.board[r][c] = "a";
			}
		}

		if (this.setState) {
			// for first call to start, setState will be absent
			this.updateStateLocallyAndRemotely(this.getState());
		}

		this.printStatus();
	}

	addPlayer(player) {
		if (this.players.a === "") {
			this.players.a = player;
			this.updateStateLocallyAndRemotely();
		} else if (this.players.b === "") {
			this.players.b = player;
			this.updateStateLocallyAndRemotely();
		}
	}

	updateStateLocallyAndRemotely() {
		this.setState(this.getState());
		// axios request
	}

	getState() {
		return {
			size: this.size,
			homeRows: this.homeRows,
			board: this.board,
			activePlayer: this.activePlayer,
			playerScore: this.playerScore,
			winner: this.winner,
			selectedPosition: this.selectedPosition,
			possibleMovesForSelectedPosition: this.possibleMovesForSelectedPosition,
			pastMoves: this.pastMoves,
			players: this.players
		};
	}

	registerSetState(setState) {
		this.setState = setState;
	}

	getActivePlayer() {
		return this.activePlayer;
	}

	toggleActivePlayer() {
		this.activePlayer = this.activePlayer === "a" ? "b" : "a";
	}

	isWrongPlayer(iAm) {
		// return false;
		return iAm !== this.activePlayer;
	}

	move(position1, position2, iAm) {
		console.log("move", position1, position2);

		if (this.players.a === "" || this.players.b === "") {
			return;
		}

		if (this.isWrongPlayer(iAm)) {
			return;
		}

		const { r: r1, c: c1 } = position1;
		const { r: r2, c: c2 } = position2;

		const piece1 = this.board[r1][c1];
		const piece2 = this.board[r2][c2];

		if (this.isActivePlayer(piece1) === false) {
			// console.log("player at position1 is not active player");
			return;
		}

		if (this.isMovePossible(position1, position2) === false) {
			// console.log("move is not possible");
			return;
		}

		const stepX = (position2.c - position1.c) / Math.abs(position2.c - position1.c);
		const stepY = (position2.r - position1.r) / Math.abs(position2.r - position1.r);

		const p1 = this.pieceAt({ r: r1, c: c1 });
		const p2 = this.pieceAt({ r: r1 + stepY, c: c1 + stepX });
		if (
			this.diagonalDistance(position1, position2) === 2 &&
			this.areOppositePieces(p1, p2) === true
		) {
			// killing the opponent
			this.board[r1 + stepY][c1 + stepX] = " ";
			this.incrementActivePlayerScore();
			// do further bonus moves till no such moves are avaiable
		}

		// moving the piece
		[this.board[r1][c1], this.board[r2][c2]] = [this.board[r2][c2], this.board[r1][c1]];

		// turning the piece1 to king if reached at opponent home
		if (piece1 === "a" && r2 === 0) {
			this.board[r2][c2] = "A";
		} else if (piece1 === "b" && r2 === this.size - 1) {
			this.board[r2][c2] = "B";
		}

		this.pastMoves.push({ from: position1, to: position2 });
		this.selectPosition(null); // iAm
		this.updateWinner();
		this.toggleActivePlayer();

		this.updateStateLocallyAndRemotely(this.getState());

		this.printStatus();
	}

	pieceAt(position) {
		return this.board[position.r][position.c];
	}

	incrementActivePlayerScore() {
		this.playerScore[this.activePlayer]++;
	}

	isActivePlayer(piece) {
		if (this.activePlayer === "a" && (piece === "a" || piece === "A")) {
			return true;
		}
		if (this.activePlayer === "b" && (piece === "b" || piece === "B")) {
			return true;
		}
		return false;
	}

	getPossibleMoves(position) {
		const { r, c } = position;
		const possibleMoves = [];
		const piece = this.board[r][c];

		if (piece === " ") {
			return possibleMoves;
		}

		const position2TopLeft = { r: r - 1, c: c - 1 };
		const position2TopRight = { r: r - 1, c: c + 1 };
		const position2BottomLeft = { r: r + 1, c: c - 1 };
		const position2BottomRight = { r: r + 1, c: c + 1 };

		// computing possible moves in top-left direction
		while (
			(piece === "a" || piece === "A" || piece === "B") &&
			this.isInsideBoard(position2TopLeft) === true
		) {
			if (this.isMovePossible(position, position2TopLeft) === true) {
				possibleMoves.push({ ...position2TopLeft });
			}
			position2TopLeft.r--;
			position2TopLeft.c--;
		}

		// computing possible moves in top-right direction
		while (
			(piece === "a" || piece === "A" || piece === "B") &&
			this.isInsideBoard(position2TopRight) === true
		) {
			if (this.isMovePossible(position, position2TopRight) === true) {
				possibleMoves.push({ ...position2TopRight });
			}
			position2TopRight.r--;
			position2TopRight.c++;
		}

		// computing possible moves in bottom-left direction
		while (
			(piece === "b" || piece === "A" || piece === "B") &&
			this.isInsideBoard(position2BottomLeft) === true
		) {
			if (this.isMovePossible(position, position2BottomLeft) === true) {
				possibleMoves.push({ ...position2BottomLeft });
			}
			position2BottomLeft.r++;
			position2BottomLeft.c--;
		}

		// computing possible moves in top-left direction
		while (
			(piece === "b" || piece === "A" || piece === "B") &&
			this.isInsideBoard(position2BottomRight) === true
		) {
			if (this.isMovePossible(position, position2BottomRight) === true) {
				possibleMoves.push({ ...position2BottomRight });
			}
			position2BottomRight.r++;
			position2BottomRight.c++;
		}

		// adding killing moves if any

		return possibleMoves;
	}

	isMovePossible(position1, position2) {
		if (this.isInsideBoard(position1) === false || this.isInsideBoard(position2) === false) {
			// console.log("position1 or position2 is not inside board");
			return false;
		}

		const { r: r1, c: c1 } = position1;
		const { r: r2, c: c2 } = position2;
		const piece1 = this.board[r1][c1];
		const piece2 = this.board[r2][c2];

		if (piece1 === " " || piece2 !== " ") {
			// console.log("position1 should have a piece and position2 should be empty");
			return false;
		}

		// here, piece1 can be "a", "b", "A", "B" and piece2 is " "

		// "a" and "b" can move only on their forward direction
		if (piece1 === "a" && r2 > r1) {
			// console.log(`${piece1} can only move up`);
			return false;
		}

		if (piece1 === "b" && r2 < r1) {
			// console.log(`${piece1} can only move down`);
			return false;
		}

		// path should be clean to be it possible move except

		const diagonalDistance = this.diagonalDistance(position1, position2);

		if (diagonalDistance === null) {
			// console.log("position1 and position2 are not along diagonal");
			return false;
		}

		if (diagonalDistance === 1) {
			return true;
		}

		const stepX = (c2 - c1) / Math.abs(c2 - c1);
		const stepY = (r2 - r1) / Math.abs(r2 - r1);

		const p1 = this.pieceAt({ r: r1, c: c1 });
		const p2 = this.pieceAt({ r: r1 + stepY, c: c1 + stepX });
		if (diagonalDistance === 2 && this.areOppositePieces(p1, p2) === true) {
			return true;
		}

		// here position2 is away from position1 by more that 1 square diagonally

		// if path is clean between the positions, return true, else false

		const position = { r: r1, c: c1 };

		while (position.r !== position2.r) {
			position.r += stepY;
			position.c += stepX;
			if (this.board[position.r][position.c] !== " ") {
				// console.log("path between position1 and position2 is not clean");
				return false;
			}
		}

		return true;
	}

	areOppositePieces(piece1, piece2) {
		if ((piece1 === "a" || piece1 === "A") && (piece2 === "b" || piece2 === "B")) {
			// console.log(piece1, piece2, "are opposite");
			return true;
		}
		if ((piece1 === "b" || piece1 === "B") && (piece2 === "a" || piece2 === "A")) {
			// console.log(piece1, piece2, "are opposite");
			return true;
		}
		// console.log(piece1, piece2, "are not opposite");
		return false;
	}

	diagonalDistance(position1, position2) {
		const dx = Math.abs(position1.r - position2.r);
		const dy = Math.abs(position1.c - position2.c);
		if (dx === dy) {
			return dx;
		} else {
			return null;
		}
	}

	isInsideBoard(position) {
		return (
			position.r >= 0 && position.r < this.size && position.c >= 0 && position.c < this.size
		);
	}

	updateWinner() {
		// winner = "pending" | "a" | "b" | "tie"
		let avaiableMoves = { a: 0, b: 0 };
		for (let r = 0; r < this.size; r++) {
			for (let c = 0; c < this.size; c++) {
				const piece = this.board[r][c];
				if (piece === "a" || piece === "A") {
					avaiableMoves["a"] += this.getPossibleMoves({ r, c }).length;
				} else if (piece === "b" || piece === "B") {
					avaiableMoves["b"] += this.getPossibleMoves({ r, c }).length;
				}
			}
		}

		if (avaiableMoves["a"] === 0 && avaiableMoves["b"] > 0) {
			this.winner = "b";
		} else if (avaiableMoves["b"] === 0 && avaiableMoves["a"] > 0) {
			this.winner = "a";
		} else if (avaiableMoves["a"] === 0 && avaiableMoves["b"] === 0) {
			this.winner = "tie";
		} else {
			this.winner = "pending";
		}

		this.updateStateLocallyAndRemotely(this.getState());
	}

	selectPosition(position, iAm) {
		if (this.players.a === "" || this.players.b === "") {
			console.log("Atleast one player is missing");
			return;
		}

		// if (this.isWrongPlayer(iAm)) {
		// 	console.log("You are not allowed to select it");
		// 	return;
		// }

		this.selectedPosition = position;

		if (this.selectedPosition === null) {
			this.possibleMovesForSelectedPosition = [];
		} else {
			const { r, c } = this.selectedPosition;
			if (this.isActivePlayer(this.board[r][c]) === false) {
				return;
			}
			this.possibleMovesForSelectedPosition = this.getPossibleMoves(this.selectedPosition);
		}

		this.updateStateLocallyAndRemotely(this.getState());
	}

	printBoard(empty = ".") {
		console.log("");
		let top = "     ";
		for (let c = 0; c < this.size; c++) {
			top += c + " ";
		}
		console.log(top);
		for (let r = 0; r < this.size; r++) {
			let row = r + "    ";
			for (let c = 0; c < this.size; c++) {
				row += (this.board[r][c] === " " ? empty : this.board[r][c]) + " ";
			}
			console.log(row);
		}
		console.log("");
	}

	printScore() {
		console.log({ playerScore: this.playerScore });
	}

	printActivePlayer() {
		console.log({ activePlayer: this.activePlayer });
	}

	printWinner() {
		console.log({ winner: this.winner });
	}

	printPastMoves() {
		console.log(this.pastMoves);
	}

	printStatus() {
		return;
		// this.printBoard();
		// this.printScore();
		// this.printActivePlayer();
		// this.printWinner();
	}
}

export const game = new Game();
console.log("game object is created");

// game.move({ r: 5, c: 0 }, { r: 3, c: 2 });
// game.move({ r: 2, c: 1 }, { r: 4, c: 3 });
// game.move({ r: 5, c: 2 }, { r: 3, c: 4 });
// game.move({ r: 2, c: 7 }, { r: 4, c: 5 });
// game.move({ r: 6, c: 1 }, { r: 5, c: 0 });
// game.move({ r: 2, c: 3 }, { r: 4, c: 1 });
// game.move({ r: 5, c: 0 }, { r: 3, c: 2 });
// game.move({ r: 2, c: 5 }, { r: 4, c: 3 });
// game.move({ r: 7, c: 0 }, { r: 6, c: 1 });
// game.move({ r: 4, c: 3 }, { r: 5, c: 2 });
// game.move({ r: 6, c: 1 }, { r: 5, c: 0 });
// game.move({ r: 5, c: 2 }, { r: 7, c: 0 });
// game.move({ r: 7, c: 2 }, { r: 6, c: 1 });
// game.move({ r: 7, c: 0 }, { r: 5, c: 2 });
// game.move({ r: 3, c: 2 }, { r: 2, c: 3 });
// game.move({ r: 1, c: 2 }, { r: 3, c: 0 });
// game.move({ r: 6, c: 3 }, { r: 4, c: 1 });
// game.move({ r: 0, c: 3 }, { r: 2, c: 1 });
// game.move({ r: 2, c: 3 }, { r: 1, c: 2 });
// game.move({ r: 4, c: 5 }, { r: 6, c: 3 });
// game.move({ r: 1, c: 2 }, { r: 0, c: 3 });
// game.move({ r: 6, c: 3 }, { r: 7, c: 2 });
// game.move({ r: 0, c: 3 }, { r: 2, c: 5 });
// game.move({ r: 7, c: 2 }, { r: 3, c: 6 });
// game.move({ r: 5, c: 6 }, { r: 1, c: 2 });
// game.move({ r: 3, c: 6 }, { r: 1, c: 4 });
// game.move({ r: 6, c: 7 }, { r: 2, c: 3 });
// game.move({ r: 3, c: 0 }, { r: 5, c: 2 });
// game.move({ r: 7, c: 4 }, { r: 6, c: 3 });
// game.move({ r: 5, c: 2 }, { r: 7, c: 4 });
// game.move({ r: 5, c: 0 }, { r: 3, c: 2 });
// game.move({ r: 2, c: 1 }, { r: 4, c: 3 });
// game.move({ r: 6, c: 5 }, { r: 5, c: 4 });
// game.move({ r: 4, c: 3 }, { r: 6, c: 5 });
// game.move({ r: 7, c: 6 }, { r: 6, c: 7 });
// game.move({ r: 1, c: 4 }, { r: 3, c: 2 });
// game.move({ r: 6, c: 7 }, { r: 5, c: 6 });
// game.move({ r: 0, c: 1 }, { r: 2, c: 3 });
// game.move({ r: 5, c: 6 }, { r: 3, c: 4 });
// game.move({ r: 2, c: 3 }, { r: 4, c: 5 });

// game.selectPosition({ r: 3, c: 2 });
// game.printPastMoves();
// game.printWinner();
