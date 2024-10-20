import { Request, Response } from "express";
import { ApiError, sendError, sendSuccess } from "../utlis/ApiResponse";
import User from "../schema/User.schema";

export const userRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneNumber, address, userType, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });
        if (existingUser) {
            return sendError(res, new ApiError(400, 'User already exists with this phone number or email.'));
        }
        const newUser = new User({
            name,
            email,
            phoneNumber,
            address,
            userType,
            password,
        });

        await newUser.save();
        const token = newUser.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: Number(process.env.TOKEN_EXPIRE),
        });

        sendSuccess(res, 201, 'User registered successfully!');


    } catch (error: any) {
        sendError(res, new ApiError(500, 'User registration failed', [error.message], error.stack));
    }
}

export const userLogin = async (req: Request, res: Response) => {
    try {

        const { identifier, password } = req.body;
        const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });

        if (!user) {
            return sendError(res, new ApiError(404, "User not found"));
        }

        const isMatchPassword = await user.isValidPassword(password);

        if (!isMatchPassword) {
            return sendError(res, new ApiError(401, "Invalid password"));
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: Number(process.env.TOKEN_EXPIRE),
        });

        // Send success response
        sendSuccess(res, 200, "Login successful", { user });
    } catch (error: any) {
        sendError(res, new ApiError(500, 'Login failed', [error.message], error.stack));

    }
}

export const userLogout=async(req:Request,res:Response)=>{
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        sendSuccess(res, 200, "Logout successful");

    }catch(error:any){
        sendError(res, new ApiError(500, 'Logout failed', [error.message], error.stack));

    }
}

