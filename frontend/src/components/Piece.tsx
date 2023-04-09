import { pieceType } from "../types";

export default function Piece({ piece, isSelected, isPossibility }: pieceType): any {
	const selectedStyle = isSelected ? { boxShadow: "0px 0px 10px white" } : {};
	const possibilityStyle = isPossibility ? { boxShadow: "0px 0px 10px white" } : {};
	const kingStyle =
		piece === "A" || piece === "B"
			? { width: "60%", height: "60%", border: "3px solid black" }
			: {};

	const color =
		piece === "a" || piece === "A"
			? "red"
			: piece === "b" || piece === "B"
			? "blue"
			: "#00000000";

	const style = {
		backgroundColor: color,
		borderRadius: "100px",
		width: "50%",
		height: "50%",
		...selectedStyle,
		...possibilityStyle,
		...kingStyle
	};

	switch (piece) {
		case " ":
			return <div style={style}></div>;
		case "a":
			return <div style={style}></div>;
		case "A":
			return <div style={style}></div>;
		case "b":
			return <div style={style}></div>;
		case "B":
			return <div style={style}></div>;
		default:
			return piece;
	}
}
