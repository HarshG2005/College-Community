import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const sem4Events = [
    { title: 'PAC Meeting', date: '2026-02-09', endDate: '2026-02-14', category: 'academic', description: 'PAC Meeting to discuss Delivery methods, Assessment methods, Learning Activities and Rubrics' },
    { title: 'IV Semester Classes Begin', date: '2026-02-16', category: 'academic', description: 'Commencement of IV Semester Classes' },
    { title: 'Course Registration BE IV Sem', date: '2026-02-16', endDate: '2026-02-18', category: 'academic', description: 'Course Registration of BE IV Semester' },
    { title: 'CCA Announcement', date: '2026-03-14', category: 'academic', description: 'Announcement of Continuous Comprehensive Assessment (CCA) - CCA1 and CCA2' },
    { title: 'Faculty Feedback-1', date: '2026-03-16', category: 'other', description: 'Faculty Feedback-1 by Students' },
    { title: 'Ugadi', date: '2026-03-19', category: 'other', description: 'Kannada New Year' },
    { title: 'Mahaveer Jayanthi', date: '2026-03-31', category: 'other', description: 'Mahaveer Jayanthi' },
    { title: 'Good Friday', date: '2026-04-03', category: 'other', description: 'Good Friday' },
    { title: 'IA1 QPs Scrutiny', date: '2026-04-08', category: 'academic', description: 'IA1 Question Papers Scrutiny' },
    { title: 'UTSAHA Fest', date: '2026-04-10', endDate: '2026-04-11', category: 'cultural', description: 'UTSAHA - College Annual Fest' },
    { title: 'Ambedkar Jayanthi', date: '2026-04-14', category: 'other', description: 'Dr. B.R. Ambedkar Jayanthi' },
    { title: 'Internal Assessment 1', date: '2026-04-15', endDate: '2026-04-17', category: 'academic', description: 'Internal Assessment 1 (IA1)' },
    { title: 'Basava Jayanthi', date: '2026-04-20', category: 'other', description: 'Basava Jayanthi' },
];

const sem6Events = [
    { title: 'Major Project Phase I - Groups', date: '2026-01-23', endDate: '2026-01-27', category: 'academic', description: 'Major Project Phase I: Group Formation and Allotment of Guides' },
    { title: 'Synopsis Submission', date: '2026-01-31', category: 'academic', description: 'Major Project Phase I: Synopsis Submission' },
    { title: 'Major Project Review 0', date: '2026-02-06', category: 'academic', description: 'Major Project Phase I Review 0: Approval of Synopsis by Review Committee' },
    { title: 'Major Project Review I', date: '2026-03-05', endDate: '2026-03-06', category: 'academic', description: 'Major Project Phase I Review I' },
    { title: 'Major Project Review II', date: '2026-04-24', endDate: '2026-04-25', category: 'academic', description: 'Major Project Phase I Review II' },
];

const sem8Events = [
    { title: 'Internship Review I', date: '2026-02-28', category: 'academic', description: 'Industry / Research Internship Presentation - Review I' },
    { title: 'Internship Review II', date: '2026-04-25', category: 'academic', description: 'Industry / Research Internship Presentation - Review II' },
];

const allEvents = [...sem4Events, ...sem6Events, ...sem8Events];

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get an admin user to be the creator
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin user found to associate events with. Please create an admin first.');
            process.exit(1);
        }

        console.log(`Using admin: ${admin.email}`);

        let count = 0;
        for (const eventData of allEvents) {
            console.log(`Processing: ${eventData.title}...`);
            const exists = await Event.findOne({ title: eventData.title, date: new Date(eventData.date) });
            if (!exists) {
                console.log(`  Adding new event: ${eventData.title}`);
                await Event.create({
                    ...eventData,
                    time: '09:00 AM', // Default time
                    venue: 'BMSIT&M Campus', // Default venue
                    createdBy: admin._id
                });
                count++;
            } else {
                console.log(`  Event already exists: ${eventData.title}`);
            }
        }

        console.log(`Migration complete! Added ${count} new events.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

migrate();
