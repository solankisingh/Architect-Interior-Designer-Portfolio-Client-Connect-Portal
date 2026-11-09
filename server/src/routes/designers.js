const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/designers - Browse and search designers with multi-filtering
router.get('/', async (req, res) => {
  try {
    const { search, style, budget, location, minExp, specialization, sort = 'rating' } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { studioName: { contains: search } },
        { tagline: { contains: search } },
        { bio: { contains: search } },
        { specializations: { contains: search } },
        { location: { contains: search } },
        { user: { name: { contains: search } } }
      ];
    }

    if (style && style !== 'All') {
      where.designStyles = { contains: style };
    }

    if (budget && budget !== 'All') {
      where.budgetTier = budget;
    }

    if (location && location !== 'All') {
      where.location = { contains: location };
    }

    if (specialization && specialization !== 'All') {
      where.specializations = { contains: specialization };
    }

    if (minExp) {
      where.experienceYears = { gte: parseInt(minExp, 10) };
    }

    let orderBy = { averageRating: 'desc' };
    if (sort === 'experience') {
      orderBy = { experienceYears: 'desc' };
    } else if (sort === 'reviews') {
      orderBy = { reviewCount: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const designers = await prisma.designerProfile.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        projects: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            category: true,
            style: true,
            thumbnail: true
          }
        },
        _count: {
          select: { projects: true, reviews: true }
        }
      }
    });

    return res.json({ designers });
  } catch (error) {
    console.error('Fetch designers error:', error);
    return res.status(500).json({ message: 'Failed to retrieve designers', error: error.message });
  }
});

// GET /api/designers/featured
router.get('/featured', async (req, res) => {
  try {
    const featured = await prisma.designerProfile.findMany({
      where: {
        OR: [
          { featured: true },
          { averageRating: { gte: 4.8 } }
        ]
      },
      take: 6,
      orderBy: { averageRating: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        projects: {
          take: 2,
          select: { id: true, title: true, category: true, thumbnail: true }
        }
      }
    });
    return res.json({ featured });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch featured designers' });
  }
});

// GET /api/designers/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const designer = await prisma.designerProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        projects: {
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    });

    if (!designer) {
      return res.status(404).json({ message: 'Designer profile not found' });
    }

    return res.json({ designer });
  } catch (error) {
    console.error('Get designer details error:', error);
    return res.status(500).json({ message: 'Failed to fetch designer details' });
  }
});

// PUT /api/designers/profile - Update own profile
router.put('/profile', authenticate, requireRole('DESIGNER'), async (req, res) => {
  try {
    const profile = await prisma.designerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Designer profile not found' });
    }

    const {
      studioName,
      tagline,
      bio,
      location,
      experienceYears,
      budgetTier,
      specializations,
      designStyles,
      avatarUrl,
      coverImageUrl,
      accreditations,
      website,
      phone
    } = req.body;

    const updated = await prisma.designerProfile.update({
      where: { id: profile.id },
      data: {
        studioName: studioName ?? profile.studioName,
        tagline: tagline ?? profile.tagline,
        bio: bio ?? profile.bio,
        location: location ?? profile.location,
        experienceYears: experienceYears ? parseInt(experienceYears, 10) : profile.experienceYears,
        budgetTier: budgetTier ?? profile.budgetTier,
        specializations: specializations ?? profile.specializations,
        designStyles: designStyles ?? profile.designStyles,
        avatarUrl: avatarUrl ?? profile.avatarUrl,
        coverImageUrl: coverImageUrl ?? profile.coverImageUrl,
        accreditations: accreditations ?? profile.accreditations,
        website: website ?? profile.website,
        phone: phone ?? profile.phone
      }
    });

    return res.json({ message: 'Profile updated successfully', profile: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;

