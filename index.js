const app = require('./server.js');

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT} ***\n`);
});