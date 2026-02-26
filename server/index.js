import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { securityMiddleware } from './middleware/security.js';

// Route imports
import authRoutes from './routes/auth.js';
import noticeRoutes from './routes/notices.js';
import materialRoutes from './routes/materials.js';
import eventRoutes from './routes/events.js';
import placementRoutes from './routes/placements.js';
import messageRoutes from './routes/messages.js';
import resumeRoutes from './routes/resumeRoutes.js';
import skillTestRoutes from './routes/skillTests.js';
import studyPlannerRoutes from './routes/studyPlanner.js';
import agentRoutes from './agent/agent.routes.js';
import adminStatsRoutes from './routes/adminStats.js';
import './agent/agentWorker.js'; // Initialize Agent Worker

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(securityMiddleware);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skill-tests', skillTestRoutes);
app.use('/api/study-planner', studyPlannerRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminStatsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'College Community API is running' });
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected');
});

console.log('Attempting to connect to MongoDB...');
console.log('URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    family: 4,
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));

export { io };
