const express = require('express');
const router = express.Router();
const {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee
} = require('../controllers/teamController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All team routes require authentication
router.use(authMiddleware);

router.get('/', listTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);
router.post('/:id/assign', assignEmployee);
router.delete('/:id/unassign', unassignEmployee);

module.exports = router;