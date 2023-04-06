class Game {
	#size = 8;
	#board = [];
	#homeRows = 3;
	#activePlayer = "a";

	// position = {r, c}

	// change piece from letter to {type, direction}

	// a = Player A
	// A = King of Player A
	// b = Player B
	// B = King of Player B

	constructor() {
		for (let r = 0; r < this.#size; r++) {
			let row = new Array(this.#size).fill(" ");
			this.#board.push(row);
		}
		for (let r = 0; r < this.#homeRows; r++) {
			let start = r % 2 === 0 ? 1 : 0;
			for (let c = start; c < this.#size; c += 2) {
				this.#board[r][c] = "b";
			}
		}
		for (let r = this.#size - 1; r > this.#size - this.#homeRows - 1; r--) {
			let start = (this.#size - r) % 2 === 0 ? 1 : 0;
			for (let c = start; c < this.#size; c += 2) {
				this.#board[r][c] = "a";
			}
		}
	}

	getActivePlayer() {
		return this.#activePlayer;
	}

	togglePlayer() {
		this.#activePlayer = this.#activePlayer === "a" ? "b" : "a";
	}

	getPossibleMoves(position1) {
		const { r, c } = position1;
		const possibleMoves = [];
		const piece = this.#board[r][c];
		if (piece === " ") {
			return possibleMoves;
		}
		const position2TopLeft = { r: position1.r - 1, c: position1.c - 1 };
		const position2TopRight = { r: position1.r - 1, c: position1.c + 1 };
		const position2BottomLeft = { r: position1.r + 1, c: position1.c - 1 };
		const position2BottomRight = { r: position1.r + 1, c: position1.c + 1 };
		while (
			(piece === "a" || piece === "A" || piece === "B") &&
			this.isMovePossible(position1, position2TopLeft) === true
		) {
			possibleMoves.push({ ...position2TopLeft });
			position2TopLeft.r--;
			position2TopLeft.c--;
		}
		while (
			(piece === "a" || piece === "A" || piece === "B") &&
			this.isMovePossible(position1, position2TopRight) === true
		) {
			possibleMoves.push({ ...position2TopRight });
			position2TopRight.r--;
			position2TopRight.c++;
		}
		while (
			(piece === "b" || piece === "A" || piece === "B") &&
			this.isMovePossible(position1, position2BottomLeft) === true
		) {
			possibleMoves.push({ ...position2BottomLeft });
			position2BottomLeft.r++;
			position2BottomLeft.c--;
		}
		while (
			(piece === "b" || piece === "A" || piece === "B") &&
			this.isMovePossible(position1, position2BottomRight) === true
		) {
			possibleMoves.push({ ...position2BottomRight });
			position2BottomRight.r++;
			position2BottomRight.c++;
		}
		return possibleMoves;
	}

	isMovePossible(position1, position2) {
		if (this.isInsideBoard(position1) === false || this.isInsideBoard(position2) === false) {
			console.log("position1 or position2 is not inside board");
			return false;
		}

		const { r: r1, c: c1 } = position1;
		const { r: r2, c: c2 } = position2;
		const piece1 = this.#board[r1][c1];
		const piece2 = this.#board[r2][c2];

		if (piece1 === " " || piece2 !== " ") {
			console.log("position1 should have a piece and position2 should be empty");
			return false;
		}

		// here, piece1 can be "a", "b", "A", "B" and piece2 is " "

		// path should be clean to be it possible move except

		const diagonalDistance = this.diagonalDistance(position1, position2);

		if (diagonalDistance === null) {
			console.log("position1 and position2 are not along diagonal");
			return false;
		}

		if (diagonalDistance === 1) {
			return true;
		}

		if (diagonalDistance === 2 && this.areOppositePieces(piece1, piece2) === true) {
			return true;
		}

		// here position2 is away from position1 by more that 1 square diagonally

		// if path is clean between the positions, return true, else false

		const stepX = (position2.c - position1.c) / Math.abs(position2.c - position1.c);
		const stepY = (position2.r - position1.r) / Math.abs(position2.r - position1.r);
		const position = { r: position1.r + stepY, c: position1.c + stepX };

		while (position.r !== position2.r) {
			position.r += stepY;
			position.c += stepX;
			if (this.#board[position.r][position.c] !== " ") {
				console.log("path between position1 and position2 is not clean");
				return false;
			}
		}

		return true;
	}

	areOppositePieces(piece1, piece2) {
		if ((piece1 === "a" || piece2 === "A") && (piece2 === "b" || piece2 === "B")) {
			return true;
		}
		if ((piece1 === "b" || piece2 === "B") && (piece2 === "a" || piece2 === "A")) {
			return true;
		}
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
			position.r >= 0 && position.r < this.#size && position.c >= 0 && position.c < this.#size
		);
	}

	print(empty = ".") {
		let top = "     ";
		for (let c = 0; c < this.#size; c++) {
			top += c + " ";
		}
		console.log(top);
		for (let r = 0; r < this.#size; r++) {
			let row = r + "    ";
			for (let c = 0; c < this.#size; c++) {
				row += (this.#board[r][c] === " " ? empty : this.#board[r][c]) + " ";
			}
			console.log(row);
		}
	}
}

const game = new Game();

game.print();

console.log(game.getPossibleMoves({ r: 2, c: 1 }));
