const { Server } = require("socket.io");

let io = null;
let quizIo = null;

// League of Legends Quiz Questions
const QUIZ_QUESTIONS = [
  // Champions
  {
    id: 1,
    question: "Which champion is known as 'The Blind Monk'?",
    options: ["Lee Sin", "Master Yi", "Jax", "Udyr"],
    correctAnswer: 0,
    category: "Champions"
  },
  {
    id: 2,
    question: "What is Jinx's real name?",
    options: ["Powder", "Vi", "Caitlyn", "Sevika"],
    correctAnswer: 0,
    category: "Lore"
  },
  {
    id: 3,
    question: "Which champion says 'Time to tinker!'?",
    options: ["Heimerdinger", "Ziggs", "Rumble", "Corki"],
    correctAnswer: 0,
    category: "Champions"
  },
  {
    id: 4,
    question: "What weapon does Darius wield?",
    options: ["Axe", "Sword", "Hammer", "Spear"],
    correctAnswer: 0,
    category: "Champions"
  },
  {
    id: 5,
    question: "Which champion has the ultimate 'Ragnarok'?",
    options: ["Olaf", "Tryndamere", "Sion", "Volibear"],
    correctAnswer: 0,
    category: "Abilities"
  },
  {
    id: 6,
    question: "What region is Ahri from?",
    options: ["Ionia", "Noxus", "Demacia", "Piltover"],
    correctAnswer: 0,
    category: "Lore"
  },
  {
    id: 7,
    question: "Which champion's passive is 'Adaptive Carapace'?",
    options: ["Malphite", "Sion", "Ornn", "Braum"],
    correctAnswer: 0,
    category: "Abilities"
  },
  {
    id: 8,
    question: "What is the name of Thresh's lantern ability?",
    options: ["Dark Passage", "Death Sentence", "Flay", "The Box"],
    correctAnswer: 0,
    category: "Abilities"
  },

  // Items
  {
    id: 9,
    question: "Which item gives 'Lifeline' shield when dropping below 30% HP?",
    options: ["Sterak's Gage", "Maw of Malmortius", "Immortal Shieldbow", "All of the above"],
    correctAnswer: 3,
    category: "Items"
  },
  {
    id: 10,
    question: "What mythic item gives Ability Haste to nearby allies?",
    options: ["Moonstone Renewer", "Shurelya's Battlesong", "Imperial Mandate", "Locket of the Iron Solari"],
    correctAnswer: 1,
    category: "Items"
  },
  {
    id: 11,
    question: "Which item's passive is 'Cleave' (AoE damage on hit)?",
    options: ["Titanic Hydra", "Ravenous Hydra", "Tiamat", "All of the above"],
    correctAnswer: 3,
    category: "Items"
  },
  {
    id: 12,
    question: "What does 'Zhonya's Hourglass' active do?",
    options: ["Grants invulnerability for 2.5s", "Teleports you to safety", "Reflects all damage", "Silences enemies"],
    correctAnswer: 0,
    category: "Items"
  },
  {
    id: 13,
    question: "Which item was reworked into 'Terminus' in 2024?",
    options: ["Divine Sunderer", "Trinity Force", "Essence Reaver", "Spear of Shojin"],
    correctAnswer: 1,
    category: "Items"
  },

  // Game Mechanics
  {
    id: 14,
    question: "How much gold does a standard minion give at 15 minutes?",
    options: ["~21 gold", "~30 gold", "~40 gold", "~50 gold"],
    correctAnswer: 0,
    category: "Game Mechanics"
  },
  {
    id: 15,
    question: "At what time does the first Dragon spawn?",
    options: ["3:00", "4:00", "5:00", "6:00"],
    correctAnswer: 2,
    category: "Game Mechanics"
  },
  {
    id: 16,
    question: "How many Rift Heralds can spawn per game (maximum)?",
    options: ["1", "2", "3", "Unlimited"],
    correctAnswer: 1,
    category: "Game Mechanics"
  },
  {
    id: 17,
    question: "What is the maximum level a champion can reach?",
    options: ["16", "18", "20", "25"],
    correctAnswer: 1,
    category: "Game Mechanics"
  },
  {
    id: 18,
    question: "How much Armor Penetration does Lord Dominik's Regards give?",
    options: ["25%", "30%", "35%", "40%"],
    correctAnswer: 2,
    category: "Items"
  },

  // Esports / History
  {
    id: 19,
    question: "Which team won the first ever World Championship (Season 1)?",
    options: ["Fnatic", "TSM", "CLG", "aAa"],
    correctAnswer: 0,
    category: "Esports"
  },
  {
    id: 20,
    question: "Who is the only player to win 3 World Championships?",
    options: ["Faker", "Uzi", "Doinb", "Tian"],
    correctAnswer: 0,
    category: "Esports"
  },
  {
    id: 21,
    question: "Which region has won the most World Championships?",
    options: ["Korea (LCK)", "China (LPL)", "Europe (LEC)", "North America (LCS)"],
    correctAnswer: 0,
    category: "Esports"
  },
  {
    id: 22,
    question: "What year was League of Legends officially released?",
    options: ["2008", "2009", "2010", "2011"],
    correctAnswer: 1,
    category: "History"
  },

  // Map / Objectives
  {
    id: 23,
    question: "Which dragon gives 'Chemtech Soul' (damage amp against shielded enemies)?",
    options: ["Chemtech Dragon", "Hextech Dragon", "Mountain Dragon", "Ocean Dragon"],
    correctAnswer: 0,
    category: "Objectives"
  },
  {
    id: 24,
    question: "What buff does Baron Nashor give?",
    options: ["Hand of Baron", "Baron's Might", "Nashor's Tooth", "Purple Buff"],
    correctAnswer: 0,
    category: "Objectives"
  },
  {
    id: 25,
    question: "How many Turret Plates are on each outer turret?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    category: "Game Mechanics"
  },

  // Abilities / Mechanics
  {
    id: 26,
    question: "What type of CC does 'Cleanse' NOT remove?",
    options: ["Suppression", "Stun", "Slow", "Root"],
    correctAnswer: 0,
    category: "Game Mechanics"
  },
  {
    id: 27,
    question: "Which summoner spell has the longest cooldown?",
    options: ["Flash", "Teleport", "Heal", "Exhaust"],
    correctAnswer: 1,
    category: "Game Mechanics"
  },
  {
    id: 28,
    question: "What is the base cooldown of Flash?",
    options: ["240s", "300s", "360s", "420s"],
    correctAnswer: 1,
    category: "Game Mechanics"
  },

  // Lore
  {
    id: 29,
    question: "Who are the 'Twin Shadows' of Ionia?",
    options: ["Yasuo & Yone", "Shen & Zed", "Akali & Kennen", "Irelia & Karma"],
    correctAnswer: 0,
    category: "Lore"
  },
  {
    id: 30,
    question: "What is the name of the city where Hextech was invented?",
    options: ["Piltover", "Zaun", "Bandle City", "Bilgewater"],
    correctAnswer: 0,
    category: "Lore"
  },
  {
    id: 31,
    question: "Which champion is the 'Aspect of Twilight'?",
    options: ["Zoe", "Taric", "Diana", "Leona"],
    correctAnswer: 0,
    category: "Lore"
  },
  {
    id: 32,
    question: "What empire does Swain rule?",
    options: ["Noxus", "Demacia", "Shurima", "Ionia"],
    correctAnswer: 0,
    category: "Lore"
  },

  // Fun / Misc
  {
    id: 33,
    question: "What does 'KS' stand for in League?",
    options: ["Kill Secured", "Kill Steal", "King Slayer", "Knight Squad"],
    correctAnswer: 1,
    category: "Terminology"
  },
  {
    id: 34,
    question: "Which role typically builds 'Sightstone' (now support items)?",
    options: ["Top", "Jungle", "Mid", "Support"],
    correctAnswer: 3,
    category: "Game Mechanics"
  },
  {
    id: 35,
    question: "What is the maximum number of Control Wards a player can place?",
    options: ["1", "2", "3", "Unlimited"],
    correctAnswer: 0,
    category: "Game Mechanics"
  },
  {
    id: 36,
    question: "Which champion says 'Ok' as their joke?",
    options: ["Malphite", "Sion", "Galio", "Ornn"],
    correctAnswer: 0,
    category: "Champions"
  }
];

// Game state storage
const games = new Map(); // roomId -> game state
const playerRooms = new Map(); // socketId -> roomId

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomQuestions(count = 5) {
  const shuffled = shuffleArray(QUIZ_QUESTIONS);
  return shuffled.slice(0, count).map((q, index) => ({
    ...q,
    questionNumber: index + 1
  }));
}

function createGameState(hostId, roomId, settings = {}) {
  const questionCount = settings.questionCount || 5;
  const timePerQuestion = settings.timePerQuestion || 15; // seconds

  return {
    roomId,
    hostId,
    status: "waiting", // waiting, playing, finished
    players: new Map(), // socketId -> { name, score, answers: [], ready: false }
    questions: getRandomQuestions(questionCount),
    currentQuestionIndex: 0,
    timePerQuestion,
    questionTimer: null,
    questionDeadline: null,
    settings: {
      questionCount,
      timePerQuestion,
      isPrivate: settings.isPrivate || false
    },
    createdAt: Date.now()
  };
}

function broadcastToRoom(roomId, event, data, excludeSocketId = null) {
  if (!quizIo) return;
  if (excludeSocketId) {
    quizIo.to(roomId).except(excludeSocketId).emit(event, data);
  } else {
    quizIo.to(roomId).emit(event, data);
  }
}

function broadcastLobbyUpdate(roomId) {
  const game = games.get(roomId);
  if (!game) return;

  quizIo.to(roomId).emit("lobby:update", {
    status: game.status,
    players: Array.from(game.players.entries()).map(([id, p]) => ({
      id,
      name: p.name,
      score: p.score,
      isHost: id === game.hostId,
      ready: p.ready
    }))
  });
}

function getGameStateForClient(game, socketId) {
  const player = game.players.get(socketId);
  const isHost = game.hostId === socketId;

  return {
    roomId: game.roomId,
    status: game.status,
    isHost,
    playerName: player?.name,
    playerScore: player?.score || 0,
    playerReady: player?.ready || false,
    players: Array.from(game.players.entries()).map(([id, p]) => ({
      id,
      name: p.name,
      score: p.score,
      isHost: id === game.hostId,
      ready: p.ready
    })),
    currentQuestion: game.status === "playing" && game.currentQuestionIndex < game.questions.length
      ? {
          ...game.questions[game.currentQuestionIndex],
          correctAnswer: undefined // Don't send correct answer to clients
        }
      : null,
    questionIndex: game.currentQuestionIndex,
    totalQuestions: game.questions.length,
    timePerQuestion: game.timePerQuestion,
    settings: game.settings
  };
}

function startQuestionTimer(roomId, game) {
  if (game.questionTimer) {
    clearInterval(game.questionTimer);
  }

  const question = game.questions[game.currentQuestionIndex];
  if (!question) return;

  let timeLeft = game.timePerQuestion;
  game.questionDeadline = Date.now() + game.timePerQuestion * 1000;

  // Send initial time
  broadcastToRoom(roomId, "question:timer", { timeLeft, totalTime: game.timePerQuestion });

  game.questionTimer = setInterval(() => {
    timeLeft = Math.max(0, Math.ceil((game.questionDeadline - Date.now()) / 1000));

    if (timeLeft > 0) {
      broadcastToRoom(roomId, "question:timer", { timeLeft, totalTime: game.timePerQuestion });
    }

    if (timeLeft <= 0) {
      clearInterval(game.questionTimer);
      game.questionTimer = null;
      handleQuestionTimeout(roomId, game);
    }
  }, 1000);
}

function handleQuestionTimeout(roomId, game) {
  // Calculate scores for players who didn't answer
  game.players.forEach((player, socketId) => {
    const currentAnswer = player.answers[game.currentQuestionIndex];
    if (currentAnswer === undefined) {
      // No answer submitted - count as wrong
      player.answers[game.currentQuestionIndex] = -1;
    }
  });

  // Send results
  sendQuestionResults(roomId, game);

  // Move to next question after a delay
  setTimeout(() => {
    nextQuestion(roomId, game);
  }, 3000);
}

function sendQuestionResults(roomId, game) {
  const question = game.questions[game.currentQuestionIndex];
  const correctAnswer = question.correctAnswer;

  const results = Array.from(game.players.entries()).map(([socketId, player]) => {
    const playerAnswer = player.answers[game.currentQuestionIndex];
    const isCorrect = playerAnswer === correctAnswer;
    const pointsEarned = isCorrect ? 10 : 0;

    if (isCorrect) {
      player.score += pointsEarned;
    }

    return {
      playerId: socketId,
      playerName: player.name,
      answer: playerAnswer,
      isCorrect,
      pointsEarned,
      totalScore: player.score
    };
  });

  // Sort by score descending
  results.sort((a, b) => b.totalScore - a.totalScore);

  broadcastToRoom(roomId, "question:results", {
    correctAnswer,
    question: question.question,
    results,
    questionIndex: game.currentQuestionIndex
  });
}

function nextQuestion(roomId, game) {
  game.currentQuestionIndex++;

  if (game.currentQuestionIndex >= game.questions.length) {
    endGame(roomId, game);
  } else {
    // Reset player answers for new question
    game.players.forEach((player) => {
      if (player.answers.length <= game.currentQuestionIndex) {
        player.answers.push(undefined);
      }
    });

    // Send new question
    const question = game.questions[game.currentQuestionIndex];
    broadcastToRoom(roomId, "question:new", {
      ...question,
      correctAnswer: undefined,
      questionNumber: game.currentQuestionIndex + 1,
      totalQuestions: game.questions.length
    });

    startQuestionTimer(roomId, game);
  }
}

function endGame(roomId, game) {
  game.status = "finished";

  // Prepare final leaderboard
  const leaderboard = Array.from(game.players.entries())
    .map(([socketId, player]) => ({
      playerId: socketId,
      playerName: player.name,
      score: player.score,
      correctAnswers: game.questions.reduce(
        (count, question, index) => count + (player.answers[index] === question.correctAnswer ? 1 : 0),
        0
      ),
      totalQuestions: game.questions.length
    }))
    .sort((a, b) => b.score - a.score);

  broadcastToRoom(roomId, "game:ended", {
    leaderboard,
    winner: leaderboard[0]?.playerName || null
  });

  // Clean up after a delay
  setTimeout(() => {
    games.delete(roomId);
    game.players.forEach((_, socketId) => {
      playerRooms.delete(socketId);
    });
  }, 30000); // Keep game data for 30 seconds for reconnection
}

function setupQuiz(server, sharedIo) {
  io = sharedIo || io;
  if (!io) {
    const allowedOrigins = (process.env.SOCKET_CORS_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
    io = new Server(server, {
      cors: { origin: allowedOrigins.length > 0 ? allowedOrigins : true }
    });
  }

  // Quiz namespace
  quizIo = io.of("/quiz");

  quizIo.on("connection", (socket) => {
    console.log(`Quiz: Client connected: ${socket.id}`);

    // Create a new game room
    socket.on("quiz:create", (data, acknowledge) => {
      try {
        const { playerName, settings } = data || {};

        if (!playerName || !playerName.trim()) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Player name is required" });
          }
          return;
        }

        // Generate a unique 6-character room ID
        let roomId;
        do {
          roomId = Math.random().toString(36).substring(2, 8).padEnd(6, "X").toUpperCase();
        } while (games.has(roomId));

        const game = createGameState(socket.id, roomId, settings);

        // Add host as player
        game.players.set(socket.id, {
          name: playerName.trim(),
          score: 0,
          answers: [],
          ready: true
        });

        games.set(roomId, game);
        playerRooms.set(socket.id, roomId);

        socket.join(roomId);
        broadcastLobbyUpdate(roomId);

        const gameState = getGameStateForClient(game, socket.id);

        if (typeof acknowledge === "function") {
          acknowledge({ success: true, game: gameState });
        }

        // Notify others in room (though host is alone initially)
        socket.to(roomId).emit("player:joined", {
          playerId: socket.id,
          playerName: playerName.trim(),
          isHost: true
        });

        console.log(`Quiz: Game created - Room: ${roomId}, Host: ${playerName}`);
      } catch (error) {
        console.error("Quiz create error:", error);
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error: "Failed to create game" });
        }
      }
    });

    // Join an existing game room
    socket.on("quiz:join", (data, acknowledge) => {
      try {
        const { roomId, playerName } = data || {};

        if (!roomId || !playerName || !playerName.trim()) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Room ID and player name are required" });
          }
          return;
        }

        const normalizedRoomId = roomId.trim().toUpperCase();
        const game = games.get(normalizedRoomId);

        if (!game) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Game not found" });
          }
          return;
        }

        if (game.status !== "waiting" && game.status !== "playing") {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Game has already finished" });
          }
          return;
        }

        if (game.players.size >= 10) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Game is full (max 10 players)" });
          }
          return;
        }

        // Check for duplicate names
        const nameExists = Array.from(game.players.values()).some(p => p.name.toLowerCase() === playerName.trim().toLowerCase());
        if (nameExists) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Name already taken in this game" });
          }
          return;
        }

        // Add player
        game.players.set(socket.id, {
          name: playerName.trim(),
          score: 0,
          answers: game.status === "playing" ? new Array(game.questions.length).fill(undefined) : [],
          ready: game.status === "waiting" ? false : true // Auto-ready if game already started
        });

        playerRooms.set(socket.id, normalizedRoomId);
        socket.join(normalizedRoomId);

        const gameState = getGameStateForClient(game, socket.id);

        if (typeof acknowledge === "function") {
          acknowledge({ success: true, game: gameState });
        }

        // Notify others
        socket.to(normalizedRoomId).emit("player:joined", {
          playerId: socket.id,
          playerName: playerName.trim(),
          isHost: false
        });
        broadcastLobbyUpdate(normalizedRoomId);

        // If game is already playing, send current question to the new player
        if (game.status === "playing") {
          const currentQuestion = game.questions[game.currentQuestionIndex];
          if (currentQuestion) {
            socket.emit("question:new", {
              ...currentQuestion,
              correctAnswer: undefined,
              questionNumber: game.currentQuestionIndex + 1,
              totalQuestions: game.questions.length
            });
            // Also send current timer state
            const timeLeft = game.questionDeadline
              ? Math.max(0, Math.ceil((game.questionDeadline - Date.now()) / 1000))
              : game.timePerQuestion;
            socket.emit("question:timer", { timeLeft, totalTime: game.timePerQuestion });
          }
        }

        console.log(`Quiz: Player joined - Room: ${roomId}, Player: ${playerName}, Status: ${game.status}`);
      } catch (error) {
        console.error("Quiz join error:", error);
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error: "Failed to join game" });
        }
      }
    });

    // Player ready/unready
    socket.on("quiz:ready", (data, acknowledge) => {
      try {
        const roomId = playerRooms.get(socket.id);
        if (!roomId) return;

        const game = games.get(roomId);
        if (!game || game.status !== "waiting") return;

        const player = game.players.get(socket.id);
        if (!player) return;

        const ready = data?.ready !== false; // default to true
        player.ready = ready;

        quizIo.to(roomId).emit("player:ready", {
          playerId: socket.id,
          playerName: player.name,
          ready
        });
        broadcastLobbyUpdate(roomId);

        if (typeof acknowledge === "function") {
          acknowledge({ success: true, ready });
        }
      } catch (error) {
        console.error("Quiz ready error:", error);
      }
    });

    // Start game (host only)
    socket.on("quiz:start", (data, acknowledge) => {
      try {
        const roomId = playerRooms.get(socket.id);
        if (!roomId) return;

        const game = games.get(roomId);
        if (!game) return;

        // Only host can start
        if (game.hostId !== socket.id) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Only host can start the game" });
          }
          return;
        }

        if (game.status !== "waiting") {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Game already started" });
          }
          return;
        }

        if (game.players.size < 2) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Need at least 2 players to start" });
          }
          return;
        }

        // Check all players ready
        const allReady = Array.from(game.players.values()).every(p => p.ready);
        if (!allReady) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "All players must be ready" });
          }
          return;
        }

        // Initialize answers array for all players
        game.players.forEach((player) => {
          player.answers = new Array(game.questions.length).fill(undefined);
        });

        game.status = "playing";
        game.currentQuestionIndex = 0;

        // Send first question
        const question = game.questions[0];
        quizIo.to(roomId).emit("game:started", {
          question: {
            ...question,
            correctAnswer: undefined,
            questionNumber: 1,
            totalQuestions: game.questions.length
          },
          timePerQuestion: game.timePerQuestion
        });

        startQuestionTimer(roomId, game);

        if (typeof acknowledge === "function") {
          acknowledge({ success: true });
        }

        console.log(`Quiz: Game started - Room: ${roomId}`);
      } catch (error) {
        console.error("Quiz start error:", error);
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error: "Failed to start game" });
        }
      }
    });

    // Submit answer
    socket.on("quiz:answer", (data, acknowledge) => {
      try {
        const roomId = playerRooms.get(socket.id);
        if (!roomId) return;

        const game = games.get(roomId);
        if (!game || game.status !== "playing") return;

        const player = game.players.get(socket.id);
        if (!player) return;

        const { answerIndex } = data || {};
        if (answerIndex === undefined || answerIndex < 0 || answerIndex > 3) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Invalid answer" });
          }
          return;
        }

        // Check if already answered this question
        if (player.answers[game.currentQuestionIndex] !== undefined) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Already answered" });
          }
          return;
        }

        player.answers[game.currentQuestionIndex] = answerIndex;

        if (typeof acknowledge === "function") {
          acknowledge({
            success: true,
            answerIndex,
            playerName: player.name
          });
        }

        const answeredCount = Array.from(game.players.values()).filter(
          p => p.answers[game.currentQuestionIndex] !== undefined
        ).length;

        quizIo.to(roomId).emit("player:answered", {
          playerId: socket.id,
          playerName: player.name,
          answerIndex,
          answeredCount,
          totalPlayers: game.players.size,
          questionIndex: game.currentQuestionIndex
        });

        // Check if all players have answered
        const allAnswered = Array.from(game.players.values()).every(
          p => p.answers[game.currentQuestionIndex] !== undefined
        );

        if (allAnswered) {
          // All answered - process results immediately
          if (game.questionTimer) {
            clearInterval(game.questionTimer);
            game.questionTimer = null;
          }

          sendQuestionResults(roomId, game);

          setTimeout(() => {
            nextQuestion(roomId, game);
          }, 3000);
        }
      } catch (error) {
        console.error("Quiz answer error:", error);
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error: "Failed to submit answer" });
        }
      }
    });

    // Leave game
    socket.on("quiz:leave", (data, acknowledge) => {
      handlePlayerLeave(socket);
      if (typeof acknowledge === "function") {
        acknowledge({ success: true });
      }
    });

    // Get game state
    socket.on("quiz:state", (data, acknowledge) => {
      try {
        const roomId = playerRooms.get(socket.id);
        if (!roomId) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Not in a game" });
          }
          return;
        }

        const game = games.get(roomId);
        if (!game) {
          if (typeof acknowledge === "function") {
            acknowledge({ success: false, error: "Game not found" });
          }
          return;
        }

        const gameState = getGameStateForClient(game, socket.id);

        if (typeof acknowledge === "function") {
          acknowledge({ success: true, game: gameState });
        }
      } catch (error) {
        console.error("Quiz state error:", error);
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error: "Failed to get game state" });
        }
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Quiz: Client disconnected: ${socket.id}`);
      handlePlayerLeave(socket);
    });

    function handlePlayerLeave(socket) {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const game = games.get(roomId);
      if (!game) {
        playerRooms.delete(socket.id);
        return;
      }

      const player = game.players.get(socket.id);
      const playerName = player?.name;
      const wasHost = game.hostId === socket.id;

      game.players.delete(socket.id);
      playerRooms.delete(socket.id);
      socket.leave(roomId);

      if (game.players.size === 0) {
        // No players left - clean up game
        if (game.questionTimer) {
          clearInterval(game.questionTimer);
        }
        games.delete(roomId);
        console.log(`Quiz: Game cleaned up - Room: ${roomId}`);
        return;
      }

      // Notify remaining players
      quizIo.to(roomId).emit("player:left", {
        playerId: socket.id,
        playerName,
        wasHost
      });

      // If host left, assign new host
      if (wasHost) {
        const newHostId = game.players.keys().next().value;
        game.hostId = newHostId;
        const newHost = game.players.get(newHostId);

        quizIo.to(roomId).emit("host:changed", {
          newHostId,
          newHostName: newHost?.name
        });

        // New host needs to be ready
        newHost.ready = false;
        quizIo.to(roomId).emit("player:ready", {
          playerId: newHostId,
          playerName: newHost.name,
          ready: false
        });
      }
      broadcastLobbyUpdate(roomId);

      // If game was playing and not enough players, end game
      if (game.status === "playing" && game.players.size < 2) {
        if (game.questionTimer) {
          clearInterval(game.questionTimer);
          game.questionTimer = null;
        }
        endGame(roomId, game);
      }

      console.log(`Quiz: Player left - Room: ${roomId}, Player: ${playerName}`);
    }
  });

  return io;
}

module.exports = { setupQuiz, getIo: () => io, getQuizIo: () => quizIo };