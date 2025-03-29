import mongoose from "mongoose";

const adminMetricsSchema = new mongoose.Schema(
  {
    users: {
      candidate: {
        type: Number,
        default: 0,
      },
      creator: {
        type: Number,
        default: 0,
      },
      admin: {
        type: Number,
        default: 0,
      },
    },
    jobListings: {
      totalJobListings: {
        type: Number,
        default: 0,
      },
      active: {
        type: Number,
        default: 0,
      },
      pending: {
        type: Number,
        default: 0,
      },
      suspended: {
        type: Number,
        default: 0,
      },
      filled: {
        type: Number,
        default: 0,
      },
      expired: {
        type: Number,
        default: 0,
      },
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    searchAnalytics: {
      jobCategories: {
        type: Map,
        of: Number,
        default: {},
      }, // e.g., { 'Construction': 15 }
      countries: {
        type: Map,
        of: Number,
        default: {},
      },
    },
  },
  { strict: true, timestamps: true }
);

const AdminMetrics = mongoose.model("AdminMetrics", adminMetricsSchema);

export default AdminMetrics;
