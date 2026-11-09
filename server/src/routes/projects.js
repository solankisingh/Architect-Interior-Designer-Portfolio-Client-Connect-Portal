const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects - List projects with category & style filtering
router.get('/', async (req, res) => {
  try {
    const { category, style, designerId, search } = req.query;

    const where = {};
    if (category && category !== 'All') {
      where.category = { contains: category };
    }
    if (style && style !== 'All') {
      where.style = { contains: style };
    }
    if (designerId) {
      where.designerId = designerId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        designer: {
          select: {
            id: true,
            studioName: true,
            location: true,
            averageRating: true,
            user: { select: { name: true } }
          }
        }
      }
    });

    return res.json({ projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        designer: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ project });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create project (Designer only)
router.post('/', authenticate, requireRole('DESIGNER'), async (req, res) => {
  try {
    const profile = await prisma.designerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(403).json({ message: 'Designer profile required to create projects.' });
    }

    const {
      title,
      category,
      style,
      description,
      location,
      completionYear,
      areaSqFt,
      budgetRange,
      thumbnail,
      images,
      isFeatured = false
    } = req.body;

    if (!title || !description || !thumbnail) {
      return res.status(400).json({ message: 'Title, description, and thumbnail image are required.' });
    }

    const project = await prisma.project.create({
      data: {
        designerId: profile.id,
        title,
        category: category || 'Residential',
        style: style || 'Modern Minimalist',
        description,
        location: location || profile.location,
        completionYear: completionYear || new Date().getFullYear().toString(),
        areaSqFt: areaSqFt || null,
        budgetRange: budgetRange || null,
        thumbnail,
        images: Array.isArray(images) ? JSON.stringify(images) : (images || JSON.stringify([thumbnail])),
        isFeatured: Boolean(isFeatured)
      }
    });

    return res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticate, requireRole('DESIGNER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { designer: true }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'ADMIN' && project.designer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    const {
      title,
      category,
      style,
      description,
      location,
      completionYear,
      areaSqFt,
      budgetRange,
      thumbnail,
      images,
      isFeatured
    } = req.body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title ?? project.title,
        category: category ?? project.category,
        style: style ?? project.style,
        description: description ?? project.description,
        location: location ?? project.location,
        completionYear: completionYear ?? project.completionYear,
        areaSqFt: areaSqFt ?? project.areaSqFt,
        budgetRange: budgetRange ?? project.budgetRange,
        thumbnail: thumbnail ?? project.thumbnail,
        images: images ? (Array.isArray(images) ? JSON.stringify(images) : images) : project.images,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : project.isFeatured
      }
    });

    return res.json({ message: 'Project updated successfully', project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticate, requireRole('DESIGNER', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { designer: true }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'ADMIN' && project.designer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await prisma.project.delete({ where: { id } });

    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;

