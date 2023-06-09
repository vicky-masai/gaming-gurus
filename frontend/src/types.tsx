export type positionType = {
	// r: Number;
	// c: Number;
	r: number;
	c: number;
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
	iAm: string;
};
