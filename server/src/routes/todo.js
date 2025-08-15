import express from 'express';
import { z } from 'zod';
import Todo from '../models/Todo.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  completed: z.boolean().optional().default(false),
  dueDate: z.string().datetime().optional(),
});

router.use(auth);

// Create
router.post('/', async (req, res) => {
  try {
    const parsed = createSchema.parse(req.body);
    const doc = await Todo.create({
      userId: req.userId,
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority,
      completed: parsed.completed,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
    });
    res.status(201).json(doc);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    return res.status(500).json({ error: 'Failed to create todo' });
  }
});

// List with pagination, filter by completed, search, and sort
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);
    const skip = (page - 1) * limit;
    const completedFilter = req.query.completed;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = { userId: req.userId };
    if (completedFilter === 'true') filter.completed = true;
    if (completedFilter === 'false') filter.completed = false;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      Todo.find(filter).sort(sortOptions).skip(skip).limit(limit),
      Todo.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit) || 1;
    res.json({ items, page, limit, total, totalPages, search, sortBy, sortOrder });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  const doc = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Update
const updateSchema = createSchema.partial();
router.put('/:id', async (req, res) => {
  try {
    const parsed = updateSchema.parse(req.body);
    const update = { ...parsed };
    if (parsed.dueDate) update.dueDate = new Date(parsed.dueDate);
    const doc = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    return res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const doc = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;


