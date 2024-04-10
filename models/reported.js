const mongoose = require('mongoose');

const ReportedSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Post',
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    reason: String,
  },
  { timestamps: true, versionKey: false, name: 'reports' }
);
ReportedSchema.index('postId', { unique: false, name: 'postwise' });

const Reported = mongoose.model('Reported', ReportedSchema);
module.exports = { Reported };
