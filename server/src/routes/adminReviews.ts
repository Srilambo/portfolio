import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { Review } from '../db/schema.js';

const router = Router();
router.use(requireAdmin);

// GET /api/admin/reviews - Get all reviews
router.get('/', async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    const data = reviews.map(r => ({ ...r, id: r._id.toString() }));
    res.json(data);
  } catch (err) {
    console.error('Failed to fetch reviews for admin:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// PUT /api/admin/reviews/:id - Toggle approved status
router.put('/:id', async (req, res) => {
  const { approved } = req.body as { approved: boolean };
  if (typeof approved !== 'boolean') {
    res.status(400).json({ error: 'Invalid approved field value' });
    return;
  }

  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json({ success: true, review: { ...updated.toObject(), id: updated._id.toString() } });
  } catch (err) {
    console.error('Failed to update review:', err);
    res.status(500).json({ error: 'Failed to update review.' });
  }
});

// DELETE /api/admin/reviews/:id - Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete review:', err);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

export default router;
