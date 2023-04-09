export default function Player({ name = "Player", player = "a", score = 0, activePlayer = "a" }) {
	const activePlayerStyle =
		player === activePlayer
			? {
					border: "5px solid orange"
			  }
			: {};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
				width: "35vw",
				margin: "10px auto"
			}}
		>
			<img
				src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png"
				style={{
					display: "block",
					width: "5vw",
					height: "5vw",
					borderRadius: "50%",
					alignItems: "center",
					...activePlayerStyle
				}}
				alt="avatar"
			/>
			<h1 style={{ fontSize: "2vw", fontWeight: "bold" }}>{name}</h1>
			<div
				style={{
					textAlign: "center",
					verticalAlign: "middle",
					backgroundColor: player === "a" ? "red" : player === "b" ? "blue" : "grey",
					color: "white",
					fontWeight: "bold",
					padding: "5px 10px",
					border: "1px solid black",
					borderRadius: "10px",
					fontSize: "1.7vw",
					width: "10vw"
				}}
			>
				Score {score}
			</div>
		</div>
	);
}
