import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import chatMessageRoutes from './routes/chatMessageRoutes.js'; // Ensure this path is correct
import { confirmQuotationEmail } from './controllers/Client/quotationController.js'; // Adjust the path as needed
import { createServer } from 'http'; // Import to create HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import { getTaskById } from './controllers/SuperAdmin/Task/saAddTaskController.js';
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app); // Create HTTP server with Express app
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with your client's URL
        methods: ["GET", "POST", "DELETE", "PATCH", "UPDATE"]
    }
});
// Use user routes
app.use('/api/users', userRoutes);

// Chat message routes
app.use('/api/messages', chatMessageRoutes); // Ensure this path is correct
app.get('/api/users/quotation/confirm/', confirmQuotationEmail);

app.get('/quotation-complete', (req, res) => {
// res.send('Quotation verification complete');
res.redirect('http://localhost:5173/quotation-complete');
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');

// After updating the database
socket.on('updateObjective', async (data) => {
      // Fetch the updated task using the getTaskById function
      const updatedTask = await getTaskById({ params: { id: data.taskId } });
  io.emit('objectiveUpdated', updatedTask); // Broadcast the latest task
});


  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({
  message: 'Something went wrong on the server!',
  error: process.env.NODE_ENV === 'production' ? {} : err.message, // Hide detailed error messages in production
});
});

app.get('/', (req, res) => {
res.send('Welcome to the API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
