import Checkers from "../components/Checkers";
import Chat from "./Chat";

export default function Game() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: "100px"
			}}
		>
			<Checkers />
			<Chat />
		</div>
	);
}
