// utils contain useful functions and tools
exports.info = (msg, meta = {}) => {
  console.log(`[INFO] ${msg}`, meta);
};

exports.error = (msg, err) => {
  console.error(`[ERROR] ${msg}`, err?.message || err);
};
