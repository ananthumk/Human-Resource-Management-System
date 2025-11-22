const { Team, Employee, Log } = require('../models');

const listTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll(req.user.orgId);
    
    // Get employee count for each team
    const teamsWithCounts = await Promise.all(
      teams.map(async (team) => {
        const employees = await Team.getEmployees(team.id, req.user.orgId);
        return { ...team, employeeCount: employees.length, employees };
      })
    );
    
    res.json({
      success: true,
      data: teamsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id, req.user.orgId);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Get employees for this team
    const employees = await Team.getEmployees(id, req.user.orgId);
    
    res.json({
      success: true,
      data: { ...team, employees }
    });
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }
    
    const team = await Team.create(req.user.orgId, name, description);
    
    // Create log
    await Log.create(req.user.orgId, req.user.userId, 'team_created', {
      teamId: team.id,
      name
    });
    
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Check if team exists
    const existingTeam = await Team.findById(id, req.user.orgId);
    if (!existingTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    const team = await Team.update(
      id,
      req.user.orgId,
      name || existingTeam.name,
      description !== undefined ? description : existingTeam.description
    );
    
    // Create log
    await Log.create(req.user.orgId, req.user.userId, 'team_updated', {
      teamId: id,
      changes: { name, description }
    });
    
    res.json({
      success: true,
      message: 'Team updated successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if team exists
    const team = await Team.findById(id, req.user.orgId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    const deleted = await Team.delete(id, req.user.orgId);
    
    if (deleted) {
      // Create log
      await Log.create(req.user.orgId, req.user.userId, 'team_deleted', {
        teamId: id,
        name: team.name
      });
      
      res.json({
        success: true,
        message: 'Team deleted successfully'
      });
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    next(error);
  }
};

const assignEmployee = async (req, res, next) => {
  try {
    const { id: teamId } = req.params;
    const { employeeId, employeeIds } = req.body;
    
    // Check if team exists
    const team = await Team.findById(teamId, req.user.orgId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Handle batch assignment
    const idsToAssign = employeeIds || [employeeId];
    
    if (!idsToAssign || idsToAssign.length === 0) {
      return res.status(400).json({ message: 'Employee ID(s) required' });
    }
    
    const results = [];
    
    for (const empId of idsToAssign) {
      // Check if employee exists and belongs to organisation
      const employee = await Employee.findById(empId, req.user.orgId);
      if (!employee) {
        results.push({ employeeId: empId, success: false, message: 'Employee not found' });
        continue;
      }
      
      const assigned = await Team.assignEmployee(teamId, empId);
      
      if (assigned) {
        // Create log
        await Log.create(req.user.orgId, req.user.userId, 'employee_assigned_to_team', {
          employeeId: empId,
          teamId,
          employeeName: `${employee.first_name} ${employee.last_name}`,
          teamName: team.name
        });
        results.push({ employeeId: empId, success: true });
      } else {
        results.push({ employeeId: empId, success: false, message: 'Already assigned' });
      }
    }
    
    res.json({
      success: true,
      message: 'Assignment operation completed',
      results
    });
  } catch (error) {
    next(error);
  }
};

const unassignEmployee = async (req, res, next) => {
  try {
    const { id: teamId } = req.params;
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }
    
    // Check if team exists
    const team = await Team.findById(teamId, req.user.orgId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Check if employee exists
    const employee = await Employee.findById(employeeId, req.user.orgId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const unassigned = await Team.unassignEmployee(teamId, employeeId);
    
    if (unassigned) {
      // Create log
      await Log.create(req.user.orgId, req.user.userId, 'employee_unassigned_from_team', {
        employeeId,
        teamId,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        teamName: team.name
      });
      
      res.json({
        success: true,
        message: 'Employee unassigned from team successfully'
      });
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee
};