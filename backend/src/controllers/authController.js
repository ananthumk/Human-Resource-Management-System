const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

const register = async (req, res, next) => {
  try {
    const { orgName, adminName, email, password } = req.body;
    
    // Validate input
    if (!orgName || !email || !password) {
      return res.status(400).json({ message: 'Organisation name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create organisation
    const org = await Organisation.create(orgName);
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create admin user
    const user = await User.create(org.id, email, passwordHash, adminName || 'Admin');
    
    // Create log
    await Log.create(org.id, user.id, 'organisation_created', {
      organisationId: org.id,
      organisationName: orgName
    });
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, orgId: org.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Organisation and admin user created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisationId: org.id,
        organisationName: org.name
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Get organisation
    const org = await Organisation.findById(user.organisation_id);
    
    // Create log
    await Log.create(user.organisation_id, user.id, 'user_login', {
      userId: user.id,
      email: user.email
    });
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisationId: user.organisation_id,
        organisationName: org.name
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Create log
    await Log.create(req.user.orgId, req.user.userId, 'user_logout', {
      userId: req.user.userId
    });
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout
};