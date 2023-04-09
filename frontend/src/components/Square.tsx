import Piece from "./Piece";
import { positionType, squareType } from "../types";
import { game } from "../game.mjs";
import Game from "../game.mjs";

export default function Square({ position, piece, selectedPosition, iAm }: squareType) {
	const remainder1 = position.r % 2;
	const remainder2 = position.c % 2;

	const style = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: remainder1 === remainder2 ? "#ddffdd" : "#33aa33",
		width: "4vw",
		height: "4vw"
	};

	const handleClick = () => {
		console.log(game.possibleMovesForSelectedPosition);
		if (isExistInPossibilities(position, game) === true) {
			game.move(game.selectedPosition, position, iAm);
		} else {
			console.log("object passed to select position", position);
			game.selectPosition(position, iAm);
		}
	};

	let isSelected = false;
	if (selectedPosition) {
		isSelected = position.r === selectedPosition.r && position.c === selectedPosition.c;
	}

	let isPossibility = isExistInPossibilities(position, game);

	return (
		<div style={style} onClick={handleClick} data-r={position.r} data-c={position.c}>
			<Piece piece={piece} isSelected={isSelected} isPossibility={isPossibility} />
		</div>
	);
}

function isExistInPossibilities(position: positionType, game: Game) {
	for (let { r, c } of game.possibleMovesForSelectedPosition) {
		if (r === position.r && c === position.c) {
			return true;
		}
	}
	return false;
}
