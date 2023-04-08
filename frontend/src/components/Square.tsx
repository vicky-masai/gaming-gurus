import Piece from "./Piece";
import { positionType, squareType } from "../types";
import { game } from "../game.mjs";
import Game from "../game.mjs";

export default function Square({ position, piece, selectedPosition }: squareType) {
	const style = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#33aa33",
		width: "4vw",
		height: "4vw"
	};

	const handleClick = () => {
		if (isExistInPossibilities(position, game) === true) {
			console.log({ selectedPosition: game.selectedPosition, position });
			game.move(game.selectedPosition, position);
		} else {
			console.log("before", game.selectedPosition);
			game.selectPosition(position);
			console.log("after", game.selectedPosition, game.possibleMovesForSelectedPosition);
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
