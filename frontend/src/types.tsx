export type positionType = {
	r: Number;
	c: Number;
};

export type pieceType = {
	piece: String;
	isSelected: Boolean;
	isPossibility: Boolean;
};

export type squareType = {
	position: positionType;
	piece: String;
	selectedPosition: positionType;
};
