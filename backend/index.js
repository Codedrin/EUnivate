import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import User from './models/Client/userModels.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import saAddTask from './models/SuperAdmin/saAddTask.js';
import { confirmQuotationEmail } from './controllers/Client/quotationController.js';
import {addNewWorkspace}from './controllers/SuperAdmin/workspaceController.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://www.eunivate.com'], 
    methods: ["GET", "POST", "DELETE", "PATCH", "UPDATE"]
  }
});

// Objective socket handler
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('task-updated', async ({ taskId, objectives }) => {
    try {
      const updatedTask = await saAddTask.findByIdAndUpdate(taskId, { objectives }, { new: true });
      io.emit('task-updated', updatedTask); // Broadcast the update to all clients
    } catch (error) {
      console.error('Error updating objectives:', error);
    }
  });
  
   // Handle message-related socket events
   socket.on('new-message', (message) => {
    io.emit('new-message', message);
  });

  socket.on('new-reply', (reply) => {
    io.emit('new-reply', reply);
  });

  socket.on('new-reaction', (reaction) => {
    io.emit('new-reaction', reaction);
  });

  socket.on('starred-message', (message) => {
    io.emit('starred-message', message);
  });

  socket.on('flagged-message', (message) => {
    io.emit('flagged-message', message);
  });

  socket.on('deleted-message', (messageId) => {
    io.emit('deleted-message', messageId);
  });

  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
export { io };

// Routes
app.use('/api/users', userRoutes);

// Workspace
app.use('/api', addNewWorkspace);
app.get('/api/users/workspaces/selected', async (req, res) => {
  try {
      const selectedWorkspaceRecord = await SelectedWorkspace.findOne().populate('selectedWorkspace'); // Populate the workspace reference
      console.log("Fetched selected workspace record:", selectedWorkspaceRecord); // Log the fetched record
      if (!selectedWorkspaceRecord) {
          return res.status(404).json({ message: 'No selected workspace found' });
      }

      return res.status(200).json({ selectedWorkspaceRecord });
  } catch (error) {
      return res.status(500).json({ error: error.message || 'Error fetching selected workspace' });
  }
});

app.get('/api/users/current-user', async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming you use req.user to get the logged-in user's ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





// Chat message routes
app.get('/api/users/quotation/confirm/', confirmQuotationEmail);

app.get('/quotation-complete', (req, res) => {
// res.send('Quotation verification complete');
res.redirect(`https://www.eunivate.com/quotation-complete`);
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});



app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
