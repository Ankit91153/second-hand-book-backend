import mongoose, { Schema, Document } from 'mongoose';

interface IOTP extends Document {
    phoneNumber: string;
    otp: string;
    expiry: Date;
}

const phoneOtpSchema = new Schema<IOTP>({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
});

phoneOtpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 }); 

const OTP = mongoose.model<IOTP>('OTP', phoneOtpSchema);
export default OTP;
