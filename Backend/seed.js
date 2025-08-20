const mongoose = require("mongoose");
const Task = require("./models/Task");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;


async function seedTasks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    const userId = "687f45d49749b0ceb132912f";

    // Prevent duplicates — only seed if less than 40 tasks for this user
    const existingTasks = await Task.countDocuments({ createdBy: userId });
    if (existingTasks >= 40) {
      console.log("⚠️ Enough tasks already exist. Skipping seeding.");
      process.exit();
    }

    const tasks = [];
    const today = new Date();

    for (let i = 0; i < 40; i++) {
      // Spread tasks over last 20 days
      const daysAgo = Math.floor(Math.random() * 20);
      const createdAt = new Date(today);
      createdAt.setDate(today.getDate() - daysAgo);

      // Random due dates — some in past, some in future
      const dueDateOffset = Math.floor(Math.random() * 10) - 5; // -5 to +4 days from createdAt
      const dueDate = new Date(createdAt);
      dueDate.setDate(createdAt.getDate() + dueDateOffset);

      // Random status: 60% incomplete, 40% complete
      const status = Math.random() > 0.6;

      tasks.push({
        title: `Task ${i + 1}: ${status ? "Completed" : "Pending"}`,
        description: `This is a ${status ? "finished" : "pending"} task created ${daysAgo} days ago.`,
        dueDate,
        status,
        file: null,
        createdBy: userId,
        createdAt,
        updatedAt: createdAt,
      });
    }

    await Task.insertMany(tasks);
    console.log(`✅ Seeded ${tasks.length} tasks successfully.`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding tasks:", err);
    process.exit(1);
  }
}

seedTasks();
