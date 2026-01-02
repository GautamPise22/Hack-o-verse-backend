// local-server.js
const app = require("./api/index"); // Import the Vercel version of the app

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Local Server running on http://localhost:${PORT}`);
});