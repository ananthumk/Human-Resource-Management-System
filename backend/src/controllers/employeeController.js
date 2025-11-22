const { Employee, Log } = require('../models');

const listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll(req.user.orgId);
    
    // Get teams for each employee
    const employeesWithTeams = await Promise.all(
      employees.map(async (emp) => {
        const teams = await Employee.getTeams(emp.id, req.user.orgId);
        return { ...emp, teams };
      })
    );
    
    res.json({
      success: true,
      data: employeesWithTeams
    });
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id, req.user.orgId);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Get teams for this employee
    const teams = await Employee.getTeams(id, req.user.orgId);
    
    res.json({
      success: true,
      data: { ...employee, teams }
    });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    
    if (!first_name || !last_name) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }
    
    const employee = await Employee.create(
      req.user.orgId,
      first_name,
      last_name,
      email,
      phone
    );
    
    // Create log
    await Log.create(req.user.orgId, req.user.userId, 'employee_created', {
      employeeId: employee.id,
      firstName: first_name,
      lastName: last_name
    });
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;
    
    // Check if employee exists
    const existingEmployee = await Employee.findById(id, req.user.orgId);
    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const employee = await Employee.update(
      id,
      req.user.orgId,
      first_name || existingEmployee.first_name,
      last_name || existingEmployee.last_name,
      email !== undefined ? email : existingEmployee.email,
      phone !== undefined ? phone : existingEmployee.phone
    );
    
    // Create log
    await Log.create(req.user.orgId, req.user.userId, 'employee_updated', {
      employeeId: id,
      changes: { first_name, last_name, email, phone }
    });
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findById(id, req.user.orgId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const deleted = await Employee.delete(id, req.user.orgId);
    
    if (deleted) {
      // Create log
      await Log.create(req.user.orgId, req.user.userId, 'employee_deleted', {
        employeeId: id,
        firstName: employee.first_name,
        lastName: employee.last_name
      });
      
      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};