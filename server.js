const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const { startMarketSimulation } = require('./services/marketDataService');
startMarketSimulation(io);


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/ipo', require('./routes/ipoRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));

// Error Handling Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Database Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.get("/", (req, res) => {
      res.send("Server running 🚀");
    });

    server.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch(err => {
    console.log("DB Error:", err);
  });
