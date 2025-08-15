import mongoose from 'mongoose';

const VALID_PRIORITIES = ['low', 'medium', 'high'];

const todoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: VALID_PRIORITIES, default: 'medium', index: true },
    completed: { type: Boolean, default: false, index: true },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculated field: task is overdue if dueDate passed and not completed
todoSchema.virtual('isOverdue').get(function computeIsOverdue() {
  if (!this.dueDate) return false;
  return !this.completed && this.dueDate.getTime() < Date.now();
});

export default mongoose.model('Todo', todoSchema);


