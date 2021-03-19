const mongoose = require('mongoose');

var comment = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Thread = mongoose.Schema(
  {
    bugType: {
      type: String,
      enum: ['Bug', 'Query'],
      default: 'Bug',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bugReporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bugPriority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low', 'Not applicable'],
      default: 'Low',
    },
    comments: {
      type: [comment],
      default: [],
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    projectId: {
      type: mongoose.Types.ObjectId,
      ref: 'Project',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Thread', Thread);
