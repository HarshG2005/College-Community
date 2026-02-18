import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing MongoDB Connection...');
console.log('URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB!');
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('Collections:', collections.map(c => c.name));

            const usersCount = await mongoose.connection.db.collection('users').countDocuments();
            console.log('Users count:', usersCount);

            if (usersCount > 0) {
                const user = await mongoose.connection.db.collection('users').findOne({});
                console.log('Sample user found:', user.email);
            } else {
                console.log('No users found in database.');
            }

        } catch (err) {
            console.error('❌ Error querying database:', err);
        } finally {
            await mongoose.disconnect();
            console.log('Disconnected.');
            process.exit(0);
        }
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
