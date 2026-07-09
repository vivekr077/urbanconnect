import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: [
                "ACTIVITY_JOIN_REQUEST",
                "ACTIVITY_JOINED",
                "ACTIVITY_REJECTED",
                "ACTIVITY_CANCELLED",
                "ACTIVITY_REMINDER",
                "SYSTEM",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({
    userId: 1,
    isRead: 1,
});

export default model("Notification", notificationSchema);