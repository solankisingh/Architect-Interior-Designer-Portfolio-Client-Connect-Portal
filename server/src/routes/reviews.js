const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews - Client submits a review
router.post('/', authenticate, async (req, res) => {
  try {
    const { designerId, rating, reviewTitle, comment, projectCategory } = req.body;

    if (!designerId || !rating || !comment) {
      return res.status(400).json({ message: 'Designer ID, rating (1-5), and comment are required.' });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    const designer = await prisma.designerProfile.findUnique({
      where: { id: designerId }
    });

    if (!designer) {
      return res.status(404).json({ message: 'Designer profile not found' });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        designerId,
        clientId: req.user.id,
        rating: numRating,
        reviewTitle: reviewTitle || 'Client Review',
        comment: comment.trim(),
        projectCategory: projectCategory || 'Design Project'
      },
      include: {
        client: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Re-aggregate average rating and reviewCount for designer
    const aggregate = await prisma.review.aggregate({
      where: { designerId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const newAvg = aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : numRating;
    const count = aggregate._count.rating || 1;

    await prisma.designerProfile.update({
      where: { id: designerId },
      data: {
        averageRating: newAvg,
        reviewCount: count
      }
    });

    return res.status(201).json({
      message: 'Review submitted successfully',
      review,
      newAverageRating: newAvg,
      reviewCount: count
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ message: 'Failed to submit review' });
  }
});

// GET /api/reviews/designer/:designerId
router.get('/designer/:designerId', async (req, res) => {
  try {
    const { designerId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { designerId },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });
    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

module.exports = router;
