//mongodb connection

mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/login", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}
connectToDatabase();
