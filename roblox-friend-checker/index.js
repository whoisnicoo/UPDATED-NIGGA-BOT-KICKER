const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve real favicon.ico
app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

// ✅ Optional: root response to verify app is running
app.get("/", (req, res) => {
  res.send("✅ Roblox Friend Checker backend is running.");
});

// ✅ Roblox POST call used by Studio script
app.post("/check-friends", async (req, res) => {
  const userId = req.body.userId;

  // Basic input validation
  if (!userId || !/^[0-9]+$/.test(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId. Must be a numeric ID." });
  }

  try {
    const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      return res.status(500).json({ error: "Unexpected response from Roblox API" });
    }

    const friendCount = data.data.length;
    console.log(`✅ User ${userId} has ${friendCount} friends`);
    res.json({ friends: friendCount });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error contacting Roblox API" });
  }
});

// ✅ Correct for Render / Railway / Replit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
