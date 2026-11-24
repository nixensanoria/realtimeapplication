require("dotenv").config();
const express = require("express");
const http = require("node:http");

const { setupChat } = require("./socket");
const { setupQuiz } = require("./socket-quiz");
const userController = require("./controllers/userController");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize both socket namespaces on the SAME server
const io = setupChat(server);    // Initializes main io instance
setupQuiz(server, io);           // Uses the same io instance for /quiz namespace

app.use(express.json());
app.use(require("cors")());

app.get("/", (req, res) => {
  res.json({ message: "Here in document root" });
});

app.get("/chat", (req, res) => {
  res.sendFile("view/chat.html", { root: __dirname });
});

app.get("/quiz", (req, res) => {
  res.sendFile("view/quiz.html", { root: __dirname });
});

app.get("/users", userController.getUsers);     // fetch All records
app.get("/users/:id", userController.getUser);  // filter record
app.post("/users", userController.createUser);  // Add record
app.put("/users/:id", userController.updateUser); // Update record
app.delete("/users/:id", userController.deleteUser); // Delete User

server.listen(PORT, () => {
  console.log(`Server is running on port ${server.address().port}`);
});