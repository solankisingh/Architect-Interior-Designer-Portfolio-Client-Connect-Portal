const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries - Submit an inquiry (Client or authenticated user)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      designerId,
      projectTitle,
      projectCategory,
      location,
      budgetRange,
      targetTimeline,
      scopeDescription,
      initialMessage
    } = req.body;

    if (!designerId || !projectTitle || !scopeDescription) {
      return res.status(400).json({ message: 'Designer, project title, and scope description are required.' });
    }

    const designer = await prisma.designerProfile.findUnique({
      where: { id: designerId }
    });

    if (!designer) {
      return res.status(404).json({ message: 'Designer profile not found' });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        clientId: req.user.id,
        designerId,
        projectTitle,
        projectCategory: projectCategory || 'Residential',
        location: location || 'Not specified',
        budgetRange: budgetRange || 'Standard',
        targetTimeline: targetTimeline || 'Flexible',
        scopeDescription,
        status: 'PENDING',
        messages: {
          create: {
            senderId: req.user.id,
            messageText: initialMessage || scopeDescription
          }
        }
      },
      include: {
        designer: {
          select: { id: true, studioName: true }
        },
        client: {
          select: { id: true, name: true, email: true }
        },
        messages: true
      }
    });

    return res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    return res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
  }
});

// GET /api/inquiries/my - Get user inquiries (role-aware: client, designer, or admin)
router.get('/my', authenticate, async (req, res) => {
  try {
    let where = {};

    if (req.user.role === 'CLIENT') {
      where = { clientId: req.user.id };
    } else if (req.user.role === 'DESIGNER') {
      const profile = await prisma.designerProfile.findUnique({
        where: { userId: req.user.id }
      });
      if (!profile) {
        return res.json({ inquiries: [] });
      }
      where = { designerId: profile.id };
    }
    // If ADMIN, where remains {} (view all)

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        designer: {
          select: {
            id: true,
            studioName: true,
            avatarUrl: true,
            user: { select: { name: true, email: true } }
          }
        },
        client: {
          select: { id: true, name: true, email: true, phone: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { messages: true }
        }
      }
    });

    return res.json({ inquiries });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return res.status(500).json({ message: 'Failed to retrieve inquiries' });
  }
});

// GET /api/inquiries/:id - Inquiry conversation details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        designer: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
        client: {
          select: { id: true, name: true, email: true, phone: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, role: true }
            }
          }
        }
      }
    });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Access check: Client, Assigned Designer, or Admin
    const isClient = inquiry.clientId === req.user.id;
    const isDesigner = inquiry.designer.userId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isDesigner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this inquiry' });
    }

    return res.json({ inquiry });
  } catch (error) {
    console.error('Get inquiry error:', error);
    return res.status(500).json({ message: 'Failed to fetch inquiry details' });
  }
});

// PATCH /api/inquiries/:id/status - Update inquiry status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'DECLINED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { designer: true }
    });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Only assigned designer or admin can change status
    const isDesigner = inquiry.designer.userId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isDesigner && !isAdmin) {
      return res.status(403).json({ message: 'Only the assigned designer or admin can update inquiry status' });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
      include: {
        designer: { select: { studioName: true } },
        client: { select: { name: true, email: true } }
      }
    });

    return res.json({ message: 'Inquiry status updated successfully', inquiry: updated });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    return res.status(500).json({ message: 'Failed to update status' });
  }
});

// POST /api/inquiries/:id/messages - Send a message in inquiry thread
router.post('/:id/messages', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { messageText } = req.body;

    if (!messageText || !messageText.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { designer: true }
    });

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const isClient = inquiry.clientId === req.user.id;
    const isDesigner = inquiry.designer.userId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isClient && !isDesigner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to send messages in this inquiry' });
    }

    const message = await prisma.inquiryMessage.create({
      data: {
        inquiryId: id,
        senderId: req.user.id,
        messageText: messageText.trim()
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    // Touch updatedAt on inquiry
    await prisma.inquiry.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;

