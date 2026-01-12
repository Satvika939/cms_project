module.exports = (req, res, next) => {
  // Simulate logged-in user
  req.user = {
    id: 'demo-user-id',
    role: 'viewer', // change to admin / viewer to test
  };
  next();
};
