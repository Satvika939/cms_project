require('dotenv').config();
const app = require('./app');
const autoPublishLessons = require('./workers/autoPublishWorker');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing');
  process.exit(1);
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Run auto-publish worker every 1 minute(background-worker)
setInterval(() => {
  autoPublishLessons().catch(err =>
    console.error('Worker crashed:', err)
  );
}, 60 * 1000);

// graceful shutdown

const shutdown = () => {
  console.log('🛑 Graceful shutdown initiated');

  clearInterval(workerInterval);

  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Force exit if server hangs
  setTimeout(() => {
    console.error('❌ Force shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown); // Docker / cloud
process.on('SIGINT', shutdown);  // Ctrl + C