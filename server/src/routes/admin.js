const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply auth and admin check to all admin routes
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/stats - System KPIs & Metrics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalDesigners,
      totalClients,
      totalProjects,
      totalInquiries,
      acceptedInquiries,
      completedInquiries,
      totalReviews
    ] = await Promise.all([
      prisma.user.count(),
      prisma.designerProfile.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.project.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'ACCEPTED' } }),
      prisma.inquiry.count({ where: { status: 'COMPLETED' } }),
      prisma.review.count()
    ]);

    const conversionRate = totalInquiries > 0
      ? Math.round(((acceptedInquiries + completedInquiries) / totalInquiries) * 100)
      : 0;

    return res.json({
      stats: {
        totalUsers,
        totalDesigners,
        totalClients,
        totalProjects,
        totalInquiries,
        acceptedInquiries,
        completedInquiries,
        conversionRate,
        totalReviews
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/users - Manage users list
router.get('/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    const where = {};

    if (role && role !== 'All') {
      where.role = role.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
        designerProfile: {
          select: {
            id: true,
            studioName: true,
            isVerified: true,
            averageRating: true,
            _count: { select: { projects: true } }
          }
        },
        _count: {
          select: { clientInquiries: true, reviews: true }
        }
      }
    });

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PATCH /api/admin/users/:id/role - Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['CLIENT', 'DESIGNER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    return res.json({ message: 'User role updated', user: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user role' });
  }
});

// PATCH /api/admin/designers/:id/verify - Toggle verification badge
router.patch('/designers/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const designer = await prisma.designerProfile.findUnique({ where: { id } });

    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    const updated = await prisma.designerProfile.update({
      where: { id },
      data: { isVerified: !designer.isVerified }
    });

    return res.json({ message: `Designer verification set to ${updated.isVerified}`, designer: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle verification' });
  }
});

// PATCH /api/admin/designers/:id/feature - Toggle featured status
router.patch('/designers/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;
    const designer = await prisma.designerProfile.findUnique({ where: { id } });

    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    const updated = await prisma.designerProfile.update({
      where: { id },
      data: { featured: !designer.featured }
    });

    return res.json({ message: `Designer featured status set to ${updated.featured}`, designer: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle featured status' });
  }
});

// DELETE /api/admin/projects/:id - Moderate/remove project
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return res.json({ message: 'Project removed by administrator' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove project' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }
    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
