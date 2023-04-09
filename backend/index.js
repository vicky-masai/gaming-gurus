const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const matchRouter = require("./routes/matchRouter");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/matches", matchRouter);

app.get("/", (req, res) => {
	res.status(200).send({ message: "Home" });
});

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on("join_room", (data) => {
		socket.join(data);
		console.log(`User with ID: ${socket.id} joined room: ${data}`);
	});

	socket.on("send_message", (data) => {
		socket.to(data.room).emit("receive_message", data);
	});

	socket.on("disconnect", () => {
		console.log("User Disconnected", socket.id);
	});
});

connectThenListen();

async function connectThenListen() {
	try {
		const connection = mongoose.connect(process.env.MONGO);
		await connection;
		server.listen(3001, () => {
			console.log("SERVER RUNNING", "http://localhost:3001");
		});
	} catch (error) {
		console.log({ error: error.message });
	}
}
