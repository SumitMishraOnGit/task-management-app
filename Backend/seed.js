// Backend/seed.js

const mongoose = require('mongoose');
const Task = require('./models/Task'); 
require('dotenv').config({ path: './.env' });

// --- IMPORTANT: This is your correct User ID ---
const USER_ID = '6880b3bf54221cf60910e509';  //
// -----------------------------------------
// --- Data for generating realistic tasks ---
const taskVerbs = ['Organize', 'Finalize', 'Review', 'Implement', 'Develop', 'Test', 'Deploy', 'Design', 'Research', 'Update'];
const taskNouns = ['the new feature', 'the user authentication', 'the database schema', 'the landing page', 'the API documentation', 'the marketing campaign', 'the Q3 report', 'the client proposal', 'the payment gateway', 'the UI mockups'];
const taskAdjectives = ['critical', 'high-priority', 'urgent', 'important', 'pending', 'ongoing', 'completed', 'new', 'archived', 'future'];

// --- Main seeding function ---
const seedDatabase = async () => {
  try {
    // 1. Validate User ID - This check is now corrected.
    if (USER_ID || !mongoose.Types.ObjectId.isValid(USER_ID)) {
      console.error('\n❌ ERROR: Please paste a valid User ID into the USER_ID variable in seed.js before running the script.\n');
      process.exit(1);
    }

    // 2. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // 3. Clear existing tasks for this user
    await Task.deleteMany({ user: USER_ID });
    console.log('🧹 Cleared old tasks for the user.');

    // 4. Generate new tasks
    const tasks = [];
    const today = new Date();
    for (let i = 0; i < 20; i++) { 
      const numTasksToday = Math.floor(Math.random() * 3) + 3;
      for (let j = 0; j < numTasksToday; j++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const task = {
          user: USER_ID,
          createdBy: USER_ID, 
          title: `${taskVerbs[Math.floor(Math.random() * taskVerbs.length)]} ${taskAdjectives[Math.floor(Math.random() * taskAdjectives.length)]} ${taskNouns[Math.floor(Math.random() * taskNouns.length)]}`,
          description: 'This is a sample description for the task.',
          dueDate: date,
          status: Math.random() > 0.4,
          createdAt: date,
          updatedAt: date,
        };
        tasks.push(task);
      }
    }
    
    // 5. Insert new tasks into the database
    await Task.insertMany(tasks);
    console.log(`🌱 Seeded ${tasks.length} new tasks for the last 20 days.`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // 6. Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
};

seedDatabase();
