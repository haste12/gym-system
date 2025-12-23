import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 1,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        months: {
            type: Number,
            required: true,
            default: 1,
        },
        paymentAmount: {
            type: Number,
            required: false,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Member || mongoose.model('Member', memberSchema);
