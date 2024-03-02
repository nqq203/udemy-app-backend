const { express } = require('../app');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware.js');

router.get('/protected-route', verifyToken, (req, res) => {
  res.status(200).send("Protected Route");
});

module.exports = router;