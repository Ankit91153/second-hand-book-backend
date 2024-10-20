import { Request, Response } from "express";
import { ApiError, sendError, sendSuccess } from "../utlis/ApiResponse";
import User from "../schema/User.schema";
import otpGenerator from 'otp-generator';
import OTP from "../schema/PhoneOtp.schema";


export const sendOtpToPhone=async(req: Request, res: Response)=>{
    const { phoneNumber } = req.body;

    try{
        const phoneRegex = /^[0-9]{10}$/; 
        if (!phoneRegex.test(phoneNumber)) {
            return sendError(res, new ApiError(400, 'Invalid phone number format.'));
        }
        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            return sendError(res, new ApiError(400, 'Phone number already exists. Please use a different number.'));
        }

        const otp = otpGenerator.generate(6, { digits: true });
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await OTP.create({
            phoneNumber,
            otp,
            expiry: otpExpiry,
        });

        sendSuccess(res, 200, 'OTP sent successfully to your phone number.',otp);



    }catch(error:any){
        sendError(res, new ApiError(500, 'Failed to send OTP', [error.message], error.stack));

    }
}

export const verifyOtpPhone=async(req: Request, res: Response)=>{
    const { phoneNumber, otp } = req.body;

    try {
        const otpEntry = await OTP.findOne({ phoneNumber });

        // Validate OTP
        if (!otpEntry || otpEntry.otp !== otp) {
            return sendError(res, new ApiError(400, 'Invalid or expired OTP.'));
        }

        await OTP.deleteOne({ phoneNumber });

        sendSuccess(res, 200, 'OTP verified successfully.');

    } catch (error:any) {
        sendError(res, new ApiError(500, 'Failed to verify OTP', [error.message], error.stack));
    }
}