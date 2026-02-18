import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import StudyMaterial from '../models/StudyMaterial.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_community';

// Real VTU Study Materials from publicly available sources
const studyMaterials = [
    // 1st Year - Physics Cycle
    {
        title: 'Engineering Mathematics I (M1) - VTU Notes',
        description: 'Complete notes for Engineering Mathematics I covering Differential Calculus, Integral Calculus, and Vector Calculus. Updated for 2022 Scheme.',
        subject: 'Mathematics',
        fileUrl: 'https://vtudeveloper.in/mathematics-1-vtu-notes/',
        fileType: 'OTHER',
        tags: ['M1', '1st Semester', 'Mathematics', 'VTU', '2022 Scheme']
    },
    {
        title: 'Engineering Physics - VTU Notes & Question Papers',
        description: 'Physics notes covering Modern Physics, Quantum Mechanics, Lasers, Optical Fibers, and Semiconductor Physics. Includes solved question papers.',
        subject: 'Physics',
        fileUrl: 'https://vtuadda.com/vtu-notes/physics/',
        fileType: 'OTHER',
        tags: ['Physics', '1st Year', 'VTU', 'Notes', 'Question Papers']
    },
    {
        title: 'Engineering Chemistry - Complete Notes',
        description: 'Chemistry notes covering Electrochemistry, Corrosion, Polymers, Nanomaterials, and Energy Sources for VTU 1st year students.',
        subject: 'Chemistry',
        fileUrl: 'https://vtuadda.com/vtu-notes/chemistry/',
        fileType: 'OTHER',
        tags: ['Chemistry', '1st Year', 'VTU', 'Notes']
    },
    {
        title: 'Elements of Civil Engineering - VTU Notes',
        description: 'Introduction to Civil Engineering covering infrastructure, surveying, building materials, and environmental engineering basics.',
        subject: 'Civil Engineering',
        fileUrl: 'https://vtucircle.com/ece-notes/',
        fileType: 'OTHER',
        tags: ['ECE', '1st Year', 'VTU', 'Civil']
    },

    // CSE Branch Materials
    {
        title: 'Data Structures and Algorithms - Complete Notes',
        description: 'Comprehensive DSA notes covering Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, and Searching algorithms with C/C++ implementations.',
        subject: 'Computer Science',
        fileUrl: 'https://vtudeveloper.in/data-structures-notes-vtu/',
        fileType: 'OTHER',
        tags: ['DSA', 'CSE', '3rd Semester', 'VTU', 'Algorithms']
    },
    {
        title: 'Operating Systems - VTU Notes & Solved Papers',
        description: 'OS concepts including Process Management, Memory Management, File Systems, and Deadlocks. Includes VTU previous year solved papers.',
        subject: 'Computer Science',
        fileUrl: 'https://vtunotesforall.in/operating-system-notes/',
        fileType: 'OTHER',
        tags: ['OS', 'Operating Systems', 'CSE', '5th Semester', 'VTU']
    },
    {
        title: 'Database Management Systems - Complete Study Material',
        description: 'DBMS notes covering ER Model, Relational Algebra, SQL, Normalization, Transaction Management, and Concurrency Control.',
        subject: 'Computer Science',
        fileUrl: 'https://vtudeveloper.in/dbms-notes-vtu/',
        fileType: 'OTHER',
        tags: ['DBMS', 'Database', 'CSE', '4th Semester', 'VTU', 'SQL']
    },
    {
        title: 'Computer Networks - VTU Notes',
        description: 'Complete CN notes covering OSI Model, TCP/IP, Network Layer Protocols, Routing, and Network Security.',
        subject: 'Computer Science',
        fileUrl: 'https://vtuadda.com/computer-networks-notes/',
        fileType: 'OTHER',
        tags: ['CN', 'Computer Networks', 'CSE', '5th Semester', 'VTU']
    },
    {
        title: 'Machine Learning - Notes & Resources',
        description: 'ML fundamentals including Supervised Learning, Unsupervised Learning, Decision Trees, SVM, Neural Networks, and practical implementations.',
        subject: 'Computer Science',
        fileUrl: 'https://vtucircle.com/machine-learning-notes/',
        fileType: 'OTHER',
        tags: ['ML', 'Machine Learning', 'CSE', 'AI', '7th Semester', 'VTU']
    },

    // ECE Branch Materials
    {
        title: 'Analog Electronics Circuits - VTU Notes',
        description: 'Complete notes on Diodes, BJT, FET, Amplifiers, Oscillators, and Operational Amplifiers with solved problems.',
        subject: 'Electronics',
        fileUrl: 'https://vtuadda.com/analog-electronics-notes/',
        fileType: 'OTHER',
        tags: ['Analog Electronics', 'ECE', '3rd Semester', 'VTU']
    },
    {
        title: 'Digital Electronics - Complete Study Material',
        description: 'Digital logic design covering Boolean Algebra, Logic Gates, Combinational Circuits, Sequential Circuits, and Memory Devices.',
        subject: 'Electronics',
        fileUrl: 'https://vtudeveloper.in/digital-electronics-notes/',
        fileType: 'OTHER',
        tags: ['Digital Electronics', 'ECE', '3rd Semester', 'VTU', 'CSE']
    },
    {
        title: 'Signals and Systems - VTU Notes',
        description: 'Comprehensive notes on Continuous and Discrete-Time Signals, LTI Systems, Fourier and Laplace Transforms.',
        subject: 'Electronics',
        fileUrl: 'https://vtuadda.com/signals-systems-notes/',
        fileType: 'OTHER',
        tags: ['Signals and Systems', 'ECE', '4th Semester', 'VTU']
    },

    // Mechanical Engineering
    {
        title: 'Engineering Mechanics - VTU Notes',
        description: 'Statics and Dynamics covering Force Systems, Equilibrium, Friction, Kinematics, and Kinetics of Particles.',
        subject: 'Mechanical',
        fileUrl: 'https://vtuadda.com/engineering-mechanics-notes/',
        fileType: 'OTHER',
        tags: ['Mechanics', 'Mechanical', '1st Year', 'VTU']
    },
    {
        title: 'Thermodynamics - Complete Notes',
        description: 'Engineering Thermodynamics covering Laws of Thermodynamics, Entropy, Gas Power Cycles, and Refrigeration.',
        subject: 'Mechanical',
        fileUrl: 'https://vtudeveloper.in/thermodynamics-notes/',
        fileType: 'OTHER',
        tags: ['Thermodynamics', 'Mechanical', '3rd Semester', 'VTU']
    },
    {
        title: 'Manufacturing Process - VTU Notes',
        description: 'Manufacturing processes including Casting, Welding, Machining, and Sheet Metal Operations with diagrams.',
        subject: 'Mechanical',
        fileUrl: 'https://vtuadda.com/manufacturing-process-notes/',
        fileType: 'OTHER',
        tags: ['Manufacturing', 'Mechanical', '4th Semester', 'VTU']
    },

    // Mathematics for all semesters
    {
        title: 'Engineering Mathematics II (M2) - VTU Notes',
        description: 'M2 notes covering Differential Equations, Linear Algebra, and Multiple Integrals for 2nd semester students.',
        subject: 'Mathematics',
        fileUrl: 'https://vtudeveloper.in/mathematics-2-vtu-notes/',
        fileType: 'OTHER',
        tags: ['M2', '2nd Semester', 'Mathematics', 'VTU', '2022 Scheme']
    },
    {
        title: 'Engineering Mathematics III (M3) - Complete Notes',
        description: 'Transform Calculus, Fourier Series, Complex Analysis, and Probability for 3rd semester engineering.',
        subject: 'Mathematics',
        fileUrl: 'https://vtudeveloper.in/mathematics-3-vtu-notes/',
        fileType: 'OTHER',
        tags: ['M3', '3rd Semester', 'Mathematics', 'VTU', 'Transform Calculus']
    },

    // Lab Manuals
    {
        title: 'C Programming Lab Manual - VTU',
        description: 'Complete C programming lab manual with programs, flowcharts, and expected outputs for all experiments.',
        subject: 'Programming',
        fileUrl: 'https://vtuadda.com/c-programming-lab-manual/',
        fileType: 'OTHER',
        tags: ['C Programming', 'Lab Manual', '1st Year', 'VTU', 'CSE']
    },
    {
        title: 'Data Structures Lab Manual - VTU',
        description: 'DS lab programs including Arrays, Linked Lists, Stacks, Queues, Trees, and Graph algorithms with complete code.',
        subject: 'Computer Science',
        fileUrl: 'https://vtuadda.com/data-structures-lab-manual/',
        fileType: 'OTHER',
        tags: ['DSA', 'Lab Manual', '3rd Semester', 'VTU', 'CSE']
    },

    // Question Papers
    {
        title: 'VTU Model Question Papers 2024-25',
        description: 'Collection of VTU model question papers for all branches and semesters. Updated for 2022 and 2025 schemes.',
        subject: 'All',
        fileUrl: 'https://vtustudent.com/',
        fileType: 'OTHER',
        tags: ['Question Papers', 'Model Papers', 'VTU', 'All Branches', '2024']
    },
    {
        title: 'VTU Previous Year Question Papers - All Branches',
        description: 'Archive of VTU previous year question papers from 2018-2024 for CSE, ECE, ME, CV, EEE branches.',
        subject: 'All',
        fileUrl: 'https://vtuadda.com/vtu-question-papers/',
        fileType: 'OTHER',
        tags: ['Question Papers', 'Previous Year', 'VTU', 'All Branches']
    },

    // Placement Preparation
    {
        title: 'Aptitude & Reasoning - Placement Prep',
        description: 'Complete aptitude preparation material covering Quantitative Aptitude, Logical Reasoning, and Verbal Ability for placements.',
        subject: 'Placement',
        fileUrl: 'https://www.indiabix.com/',
        fileType: 'OTHER',
        tags: ['Aptitude', 'Placement', 'Reasoning', 'Interview Prep']
    },
    {
        title: 'DSA for Interviews - LeetCode Patterns',
        description: 'Curated collection of Data Structures and Algorithms problems commonly asked in tech interviews with solutions.',
        subject: 'Placement',
        fileUrl: 'https://neetcode.io/',
        fileType: 'OTHER',
        tags: ['DSA', 'LeetCode', 'Interview', 'Coding', 'Placement']
    }
];

const seedStudyMaterials = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find a user to attribute uploads to
        let user = await User.findOne({ email: 'principal@bmsit.in' });
        if (!user) {
            user = await User.findOne({});
        }

        if (!user) {
            console.log('❌ No users found. Please register a user first.');
            process.exit(1);
        }

        console.log(`📝 Attributing uploads to: ${user.name} (${user.email})`);

        let added = 0;
        let skipped = 0;

        for (const material of studyMaterials) {
            // Check if material already exists
            const exists = await StudyMaterial.findOne({ fileUrl: material.fileUrl });
            if (exists) {
                console.log(`⏭️  Skipping (exists): ${material.title}`);
                skipped++;
                continue;
            }

            const newMaterial = new StudyMaterial({
                ...material,
                uploadedBy: user._id,
                fileSize: 0
            });

            await newMaterial.save();
            console.log(`✅ Added: ${material.title}`);
            added++;
        }

        console.log('\n========================================');
        console.log(`📚 Seeding Complete!`);
        console.log(`   ✅ Added: ${added} materials`);
        console.log(`   ⏭️  Skipped: ${skipped} (already exist)`);
        console.log(`   📊 Total in database: ${await StudyMaterial.countDocuments()}`);
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error seeding materials:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedStudyMaterials();
