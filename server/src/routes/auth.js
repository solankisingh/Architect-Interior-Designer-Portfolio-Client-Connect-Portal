const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'CLIENT', phone, studioName, bio, location, specializations, designStyles, budgetTier, experienceYears } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        role: role.toUpperCase(),
        phone: phone || null,
      }
    });

    // If designer, create profile
    let designerProfile = null;
    if (user.role === 'DESIGNER') {
      designerProfile = await prisma.designerProfile.create({
        data: {
          userId: user.id,
          studioName: studioName || `${name}'s Studio`,
          bio: bio || 'Professional architect & interior designer passionate about crafting exceptional spaces.',
          location: location || 'Global',
          specializations: specializations || 'Residential, Interior Design',
          designStyles: designStyles || 'Modern Minimalist, Contemporary',
          budgetTier: budgetTier || '$$',
          experienceYears: experienceYears ? parseInt(experienceYears, 10) : 3,
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
          coverImageUrl: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80`,
          accreditations: 'Registered Design Professional',
        }
      });
    }

    const token = generateToken(user.id, user.role);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        designerProfile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { designerProfile: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        designerProfile: user.designerProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// POST /api/auth/demo-login
// Fast switcher for testing Client, Designer, and Admin roles
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body; // 'CLIENT', 'DESIGNER', or 'ADMIN'
    const targetRole = (role || 'CLIENT').toUpperCase();

    const user = await prisma.user.findFirst({
      where: { role: targetRole },
      include: { designerProfile: true }
    });

    if (!user) {
      return res.status(404).json({ message: `No demo account found for role ${targetRole}. Please seed the database.` });
    }

    const token = generateToken(user.id, user.role);

    return res.json({
      message: `Switched to demo ${targetRole} successfully`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        designerProfile: user.designerProfile
      }
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({ message: 'Server error during demo login', error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      phone: req.user.phone,
      designerProfile: req.user.designerProfile
    }
  });
});

module.exports = router;

