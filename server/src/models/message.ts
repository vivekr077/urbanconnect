import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
    {
        activityId: {
            type: String,
            required: true,
            index: true,
        },

        senderId: {
            type: String,
            required: true,
            index: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        messageType: {
            type: String,
            enum: ["TEXT", "IMAGE", "VIDEO", "FILE"],
            default: "TEXT",
        },

        mediaUrl: {
            type: String,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },

        editedAt: {
            type: Date,
        },

        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({
    activityId: 1,
    createdAt: 1,
});

export default model("Message", messageSchema);