import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        shortURL: {
            type: String,
            unique: true,
            required: true,
        },
        redirected_url: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // User model ka naam
            required: true,
        },
        visit_history: [
            {
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Performance ke liye Compound Index (Query fast karne ke liye)
urlSchema.index({ redirected_url: 1, createdBy: 1 });

const url_model = mongoose.model("url", urlSchema);

export { url_model };