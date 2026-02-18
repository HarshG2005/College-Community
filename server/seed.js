import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define schemas inline for seeding
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'student' },
    branch: String,
    year: Number,
    skills: [String],
    bio: String
}, { timestamps: true });

const noticeSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    isPinned: Boolean
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    date: Date,
    time: String,
    venue: String,
    organizer: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: Number,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const materialSchema = new mongoose.Schema({
    title: String,
    description: String,
    subject: String,
    fileUrl: String,
    fileType: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downloads: Number,
    tags: [String]
}, { timestamps: true });

const placementSchema = new mongoose.Schema({
    type: String,
    company: String,
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    package: String,
    location: String,
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Notice = mongoose.model('Notice', noticeSchema);
const Event = mongoose.model('Event', eventSchema);
const StudyMaterial = mongoose.model('StudyMaterial', materialSchema);
const PlacementPost = mongoose.model('PlacementPost', placementSchema);

async function seed() {
    try {
        console.log('🌱 Starting BMSIT database seeding...\n');

        // Clear existing data
        await User.deleteMany({});
        await Notice.deleteMany({});
        await Event.deleteMany({});
        await StudyMaterial.deleteMany({});
        await PlacementPost.deleteMany({});
        console.log('✓ Cleared existing data');

        // Hash password for demo users
        const hashedPassword = await bcrypt.hash('bmsit2024', 10);

        // Create Users - BMSIT Students and Faculty
        const users = await User.insertMany([
            {
                name: 'Dr. Mohan Babu G N',
                email: 'principal@bmsit.in',
                password: hashedPassword,
                role: 'admin',
                branch: 'Administration',
                bio: 'Principal, BMSIT&M'
            },
            {
                name: 'Priya Sharma',
                email: 'priya.sharma@bmsit.in',
                password: hashedPassword,
                role: 'student',
                branch: 'Computer Science & Engineering',
                year: 4,
                skills: ['Python', 'Machine Learning', 'React', 'MongoDB'],
                bio: '4th Year CSE student, AI/ML enthusiast'
            },
            {
                name: 'Rahul Reddy',
                email: 'rahul.reddy@bmsit.in',
                password: hashedPassword,
                role: 'student',
                branch: 'Information Science & Engineering',
                year: 3,
                skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
                bio: 'Full-stack developer, Open source contributor'
            },
            {
                name: 'Ananya Krishnan',
                email: 'ananya.k@bmsit.in',
                password: hashedPassword,
                role: 'student',
                branch: 'Electronics & Communication',
                year: 4,
                skills: ['VLSI', 'Embedded Systems', 'IoT', 'C++'],
                bio: 'ECE student interested in VLSI Design'
            },
            {
                name: 'Vikram Singh',
                email: 'vikram.singh@bmsit.in',
                password: hashedPassword,
                role: 'student',
                branch: 'Artificial Intelligence & ML',
                year: 2,
                skills: ['Python', 'TensorFlow', 'Deep Learning'],
                bio: 'AI/ML enthusiast, Kaggle contributor'
            },
            {
                name: 'Sneha Patil',
                email: 'sneha.patil@bmsit.in',
                password: hashedPassword,
                role: 'student',
                branch: 'Mechanical Engineering',
                year: 3,
                skills: ['AutoCAD', 'SolidWorks', '3D Printing'],
                bio: 'Mechanical engineer with passion for manufacturing'
            },
            {
                name: 'Training & Placement Cell',
                email: 'placement@bmsit.in',
                password: hashedPassword,
                role: 'admin',
                branch: 'Training & Placement',
                bio: 'BMSIT Training & Placement Cell - Established 2004'
            }
        ]);
        console.log(`✓ Created ${users.length} users`);

        const [admin, priya, rahul, ananya, vikram, sneha, tpc] = users;

        // Create Notices - BMSIT Announcements
        const notices = await Notice.insertMany([
            {
                title: '🎓 Placement Season 2025 - Record Breaking Year!',
                content: `Dear Students,

We are thrilled to announce that BMSIT has achieved a remarkable milestone in placements for 2025!

📊 Placement Highlights:
• Highest Package: ₹46.7 LPA
• Average Package: ₹8.97 LPA
• Median Package: ₹6.20 LPA
• Total Offers: 901
• Students Placed: 663
• Companies Visited: 203

Top recruiters include Microsoft, Amazon, Google, Infosys, TCS, Wipro, and many more!

ISE department leads with 85.33% placement rate.

Congratulations to all placed students!`,
                category: 'placement',
                author: tpc._id,
                isPinned: true
            },
            {
                title: 'Techkshetra 2026 - Technical Symposium',
                content: `BMSIT's flagship technical symposium "Techkshetra 2026" is here!

📅 Dates: February 20-22, 2026
📍 Venue: Main Auditorium & Labs

Events:
• Hackathon (24 hours)
• Paper Presentation
• Coding Contest
• Robotics Challenge
• Project Exhibition
• Gaming Tournament

🏆 Prizes worth ₹2,00,000!

Registration opens on February 10th. Early bird discount available!

Organized by: IEEE Student Branch, BMSIT`,
                category: 'event',
                author: admin._id,
                isPinned: true
            },
            {
                title: 'End Semester Examinations Schedule',
                content: `The End Semester Examinations for Even Semester 2025-26 will commence from March 15, 2026.

Important Dates:
• Last working day: March 10, 2026
• Exam commencement: March 15, 2026
• Results expected: April 15, 2026

Hall tickets will be available from March 5, 2026.

Students with fee dues will not be issued hall tickets. Clear all dues before March 1, 2026.

All the best for your exams!`,
                category: 'academic',
                author: admin._id,
                isPinned: false
            },
            {
                title: 'New AI & ML Lab Inauguration',
                content: `We are excited to announce the inauguration of our new state-of-the-art AI & Machine Learning Laboratory!

🖥️ Features:
• 50 High-performance workstations with NVIDIA RTX GPUs
• Dedicated servers for deep learning
• Cloud computing access (AWS, GCP, Azure)
• IoT and Edge AI development kits

The lab will be open for all CSE, ISE, and AI&ML students.

Book your slots through the college portal.`,
                category: 'academic',
                author: admin._id,
                isPinned: false
            },
            {
                title: 'Cultural Fest "Sarvesh 2026" - Save the Date!',
                content: `Get ready for the biggest cultural extravaganza of the year!

🎭 SARVESH 2026 - Where Talents Unite

📅 March 25-27, 2026
📍 BMSIT Campus

Highlights:
• Celebrity Night (Artist TBA)
• Battle of Bands
• Fashion Show
• Dance Competition
• Car & Bike Show
• Art Exhibition
• Food Festival

Registrations opening soon!`,
                category: 'event',
                author: admin._id,
                isPinned: false
            },
            {
                title: 'Campus Wifi Network Upgrade',
                content: `Dear Students and Faculty,

We are pleased to inform you that our campus WiFi network has been upgraded to provide faster and more reliable connectivity.

🌐 New Features:
• Speed increased to 1 Gbps
• Extended coverage in hostels
• Seamless roaming across campus
• Enhanced security protocols

Connect using your BMSIT credentials.

For issues, contact IT Support: itsupport@bmsit.in`,
                category: 'general',
                author: admin._id,
                isPinned: false
            }
        ]);
        console.log(`✓ Created ${notices.length} notices`);

        // Create Events - BMSIT Events
        const events = await Event.insertMany([
            {
                title: 'Techkshetra 2026 - 24-Hour Hackathon',
                description: `Join BMSIT's premier hackathon! Build innovative solutions for real-world problems. Team size: 2-4 members. 

Themes: Healthcare, Education, Sustainability, FinTech

Prizes: 1st - ₹50,000 | 2nd - ₹30,000 | 3rd - ₹20,000

Food and accommodation provided. Mentors from top companies!`,
                category: 'hackathon',
                date: new Date('2026-02-20'),
                time: '09:00 AM',
                venue: 'CSE Block, Computer Labs',
                organizer: 'IEEE Student Branch, BMSIT',
                createdBy: admin._id,
                maxParticipants: 200
            },
            {
                title: 'AWS Cloud Computing Workshop',
                description: `Hands-on workshop on AWS Cloud Services by AWS Certified Solutions Architect.

Topics:
• EC2 & S3 Fundamentals
• Lambda & Serverless
• RDS & DynamoDB
• IAM & Security

Free AWS credits for participants! Certificate provided.`,
                category: 'workshop',
                date: new Date('2026-02-15'),
                time: '10:00 AM',
                venue: 'Seminar Hall A',
                organizer: 'Cloud Computing Club',
                createdBy: rahul._id,
                maxParticipants: 100
            },
            {
                title: 'Machine Learning with Python - Bootcamp',
                description: `5-day intensive bootcamp on Machine Learning fundamentals.

Day 1: Python for ML
Day 2: Data Preprocessing & Visualization
Day 3: Supervised Learning
Day 4: Unsupervised Learning
Day 5: Deep Learning Introduction

Prerequisites: Basic Python knowledge. Laptop required.`,
                category: 'workshop',
                date: new Date('2026-02-25'),
                time: '09:30 AM',
                venue: 'AI & ML Lab',
                organizer: 'AI & ML Department',
                createdBy: priya._id,
                maxParticipants: 50
            },
            {
                title: 'Industry Connect: Career Guidance Seminar',
                description: `Learn what it takes to succeed in the tech industry from experienced professionals.

Speakers:
• Sr. Software Engineer, Microsoft
• Product Manager, Amazon
• Tech Lead, Flipkart

Topics: Resume building, Interview tips, Industry trends.`,
                category: 'seminar',
                date: new Date('2026-02-18'),
                time: '02:00 PM',
                venue: 'Main Auditorium',
                organizer: 'Training & Placement Cell',
                createdBy: tpc._id,
                maxParticipants: 500
            },
            {
                title: 'Sarvesh 2026 - Battle of Bands',
                description: `Calling all musicians! Showcase your talent at BMSIT's biggest cultural event.

Rules:
• Band size: 4-8 members
• Performance time: 15-20 mins
• Genre: Open
• Original compositions get bonus points

Prize: ₹25,000 + Recording session!`,
                category: 'cultural',
                date: new Date('2026-03-25'),
                time: '06:00 PM',
                venue: 'Open Air Theatre',
                organizer: 'Cultural Committee',
                createdBy: admin._id,
                maxParticipants: 30
            },
            {
                title: 'Cricket Tournament - Inter-Branch',
                description: `Annual inter-branch cricket tournament. Form your department team and compete for the championship!

Format: T20
Teams: CSE, ISE, ECE, EEE, Mech, Civil, AI&ML

Trophy + Cash prize for winners. Register your team now!`,
                category: 'sports',
                date: new Date('2026-03-01'),
                time: '08:00 AM',
                venue: 'BMSIT Cricket Ground',
                organizer: 'Sports Committee',
                createdBy: admin._id,
                maxParticipants: 140
            }
        ]);
        console.log(`✓ Created ${events.length} events`);

        // Create Study Materials
        const materials = await StudyMaterial.insertMany([
            {
                title: 'Data Structures & Algorithms - Complete Notes',
                description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, sorting, and dynamic programming. Includes solved examples and practice problems.',
                subject: 'Data Structures',
                fileUrl: 'https://example.com/dsa-notes.pdf',
                fileType: 'PDF',
                uploadedBy: priya._id,
                downloads: 234,
                tags: ['DSA', 'Algorithms', 'Interview Prep']
            },
            {
                title: 'Operating Systems - VTU Question Papers (2020-2025)',
                description: 'Collection of VTU OS question papers from 2020 to 2025 with solutions for selected questions.',
                subject: 'Operating Systems',
                fileUrl: 'https://example.com/os-papers.pdf',
                fileType: 'PDF',
                uploadedBy: rahul._id,
                downloads: 189,
                tags: ['VTU', 'Question Papers', 'OS']
            },
            {
                title: 'Machine Learning Lab Programs',
                description: 'All ML lab programs with code, outputs, and viva questions. Includes Decision Trees, SVM, Neural Networks, and K-Means.',
                subject: 'Machine Learning',
                fileUrl: 'https://example.com/ml-lab.pdf',
                fileType: 'PDF',
                uploadedBy: vikram._id,
                downloads: 342,
                tags: ['ML', 'Lab', 'Python']
            },
            {
                title: 'DBMS Notes - Normalization & SQL',
                description: 'Detailed notes on database normalization (1NF to BCNF), SQL queries, joins, and transaction management.',
                subject: 'Database Management',
                fileUrl: 'https://example.com/dbms-notes.pdf',
                fileType: 'PDF',
                uploadedBy: priya._id,
                downloads: 156,
                tags: ['DBMS', 'SQL', 'Normalization']
            },
            {
                title: 'Computer Networks - Module 1 to 5',
                description: 'Complete CN notes covering OSI model, TCP/IP, routing protocols, network security, and wireless networks.',
                subject: 'Computer Networks',
                fileUrl: 'https://example.com/cn-notes.pdf',
                fileType: 'PDF',
                uploadedBy: rahul._id,
                downloads: 278,
                tags: ['Networks', 'TCP/IP', 'OSI']
            },
            {
                title: 'VLSI Design - Lab Manual',
                description: 'Complete lab manual with Verilog and VHDL programs for VLSI design course.',
                subject: 'VLSI Design',
                fileUrl: 'https://example.com/vlsi-lab.pdf',
                fileType: 'PDF',
                uploadedBy: ananya._id,
                downloads: 98,
                tags: ['VLSI', 'Verilog', 'ECE']
            },
            {
                title: 'Engineering Mathematics - III Formula Sheet',
                description: 'Quick revision formula sheet for M3 covering Fourier series, Laplace transforms, and Z-transforms.',
                subject: 'Mathematics',
                fileUrl: 'https://example.com/m3-formulas.pdf',
                fileType: 'PDF',
                uploadedBy: sneha._id,
                downloads: 445,
                tags: ['Maths', 'Formulas', 'M3']
            },
            {
                title: 'Web Development - MERN Stack Tutorial',
                description: 'Step-by-step guide to building full-stack applications with MongoDB, Express, React, and Node.js.',
                subject: 'Web Development',
                fileUrl: 'https://example.com/mern-tutorial.pdf',
                fileType: 'PDF',
                uploadedBy: rahul._id,
                downloads: 312,
                tags: ['MERN', 'React', 'Node.js']
            }
        ]);
        console.log(`✓ Created ${materials.length} study materials`);

        // Create Placement Posts
        const placementPosts = await PlacementPost.insertMany([
            {
                type: 'experience',
                company: 'Microsoft',
                title: 'SDE Intern Interview Experience - Microsoft IDC',
                content: `I got selected for Microsoft SDE Intern position. Here's my interview experience:

📝 Online Assessment (90 mins):
• 3 coding questions (2 medium, 1 hard)
• Topics: Arrays, DP, Graphs

💼 Round 1 - DSA (45 mins):
• LRU Cache implementation
• Find cycle in directed graph

💼 Round 2 - DSA + Problem Solving (1 hour):
• Design a rate limiter
• System design basics

💼 Round 3 - HR:
• Why Microsoft?
• Behavioral questions

📚 Preparation:
• Striver's SDE Sheet
• LeetCode Premium
• OOP concepts
• OS & DBMS basics

Tips: Focus on explaining your approach clearly!`,
                author: priya._id,
                role: 'SDE Intern',
                package: '₹1.5 LPA (Intern) + PPO',
                location: 'Bangalore',
                tags: ['Microsoft', 'SDE', 'Interview']
            },
            {
                type: 'experience',
                company: 'Amazon',
                title: 'Amazon SDE-1 Off-Campus Interview',
                content: `Selected for Amazon SDE-1! Off-campus application through referral.

📝 Online Assessment:
• 2 coding questions (70 mins)
• Work style assessment

💼 Round 1 - DSA:
• Two Sum variations
• Binary tree problems

💼 Round 2 - DSA + LP:
• Merge K sorted lists
• Leadership Principles questions

💼 Round 3 - System Design:
• Design URL shortener
• Discussed scalability

💼 Round 4 - Bar Raiser:
• Behavioral deep dive
• Complex DP problem

Key: Master Amazon's 16 Leadership Principles!`,
                author: rahul._id,
                role: 'SDE-1',
                package: '₹26.4 LPA',
                location: 'Bangalore',
                tags: ['Amazon', 'SDE', 'Off-Campus']
            },
            {
                type: 'experience',
                company: 'Infosys',
                title: 'Infosys SP Role - On-Campus Selection',
                content: `Got selected for Infosys Specialist Programmer role through campus placement.

Process:
1. Online Test (InfyTQ) - 3 hours
   • Coding (3 questions)
   • MCQs on programming

2. Technical Interview:
   • Project discussion
   • Java/Python questions
   • SQL queries

3. HR Interview:
   • About Infosys
   • Relocation willingness

Preparation: Complete InfyTQ certification, practice on HackerRank.

Package: ₹6.25 LPA + Benefits`,
                author: ananya._id,
                role: 'Specialist Programmer',
                package: '₹6.25 LPA',
                location: 'Mysore/Bangalore',
                tags: ['Infosys', 'SP', 'On-Campus']
            },
            {
                type: 'alert',
                company: 'Google',
                title: '🚨 Google STEP Internship 2026 - Applications Open!',
                content: `Google STEP Internship applications are now open for 1st and 2nd year students!

Eligibility:
• 1st or 2nd year B.Tech students
• Strong programming fundamentals

How to Apply:
1. Visit careers.google.com
2. Search for "STEP Intern India"
3. Submit resume and application

Deadline: February 28, 2026

This is a great opportunity for early-year students!`,
                author: tpc._id,
                role: 'STEP Intern',
                package: 'Competitive Stipend',
                location: 'Bangalore/Hyderabad',
                tags: ['Google', 'Internship', 'Freshers']
            },
            {
                type: 'alert',
                company: 'Flipkart',
                title: '🚨 Flipkart GRiD 6.0 - Hiring Challenge',
                content: `Flipkart GRiD 6.0 - E-Commerce & Tech Challenge is LIVE!

About GRiD:
• India's largest student challenge
• Top performers get PPIs and internships

Tracks:
1. Software Development
2. Robotics
3. Information Security

Registration: Unstop.com
Team Size: 1-3 members
Last Date: March 15, 2026

Prizes worth ₹6 Lakhs + Pre-Placement Interviews!`,
                author: tpc._id,
                role: 'Multiple Roles',
                package: 'PPI Opportunity',
                location: 'Bangalore',
                tags: ['Flipkart', 'Competition', 'GRiD']
            },
            {
                type: 'resource',
                company: 'General',
                title: '📚 Complete Interview Preparation Roadmap',
                content: `Here's a comprehensive roadmap for placement preparation:

📌 PHASE 1 (2-3 months): DSA Foundation
• Arrays, Strings, Linked Lists
• Stacks, Queues, Trees
• Graphs, DP, Recursion
• Resources: Striver's A2Z, NeetCode

📌 PHASE 2 (1 month): CS Fundamentals
• Operating Systems
• Database Management
• Computer Networks
• OOP Concepts

📌 PHASE 3 (1-2 months): Development Skills
• Pick one: Web Dev / App Dev / ML
• Build 2-3 solid projects
• Contribute to open source

📌 PHASE 4 (Ongoing): Practice
• LeetCode Daily
• Mock interviews
• Resume building

Good luck with your preparations!`,
                author: priya._id,
                role: 'Guide',
                tags: ['Preparation', 'Interview', 'Roadmap']
            }
        ]);
        console.log(`✓ Created ${placementPosts.length} placement posts`);

        console.log('\n🎉 BMSIT Database seeding completed successfully!\n');
        console.log('📧 Demo Login Credentials:');
        console.log('   Email: priya.sharma@bmsit.in');
        console.log('   Password: bmsit2024\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
}

seed();
