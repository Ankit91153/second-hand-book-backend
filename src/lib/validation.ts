import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError, sendError } from "../utlis/ApiResponse";

const validateHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return sendError(res, new ApiError(400, "Validation Error", errorMessages));
    }

    next();
};


const registerValidator = () => [
    body("name")
        .notEmpty().withMessage("Name is required.")
        .isString().withMessage("Name must be a string."),
    body("email")
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email format.")
        .normalizeEmail(),
    body("phoneNumber")
        .notEmpty().withMessage("Phone number is required.")
        .isString().withMessage("Phone number must be a string."),
    body("address")
        .notEmpty().withMessage("Address is required.")
        .isString().withMessage("Address must be a string."),
    body("userType")
        .notEmpty().withMessage("User type is required.")
        .isIn(['buyer', 'seller']).withMessage("User type must be either 'buyer' or 'seller'."),
    body("password")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
];

const createBookValidator = () => [
    body("title")
        .notEmpty().withMessage("Title is required.")
        .isString().withMessage("Title must be a string."),
    body("class")
        .notEmpty().withMessage("Class ID is required.")
        .isMongoId().withMessage("Invalid Class ID format."),
    body("subject")
        .notEmpty().withMessage("Subject ID is required.")
        .isMongoId().withMessage("Invalid Subject ID format."),
    body("author")
        .notEmpty().withMessage("Author is required.")
        .isString().withMessage("Author must be a string."),
    body("price")
        .notEmpty().withMessage("Price is required.")
        .isNumeric().withMessage("Price must be a number."),
    body("seller")
        .notEmpty().withMessage("Seller ID is required.")
        .isMongoId().withMessage("Invalid Seller ID format."),
    body("description")
        .notEmpty().withMessage("Description is required.")
        .isString().withMessage("Description must be a string."),
    body("smallVideo")
        .optional()
        .isString().withMessage("Small video must be a string."),
    body("images")
        .optional()
        .isArray().withMessage("Images must be an array of strings.")
        .custom((value) => {
            // Ensure all elements in the array are strings
            if (!value.every((url:any) => typeof url === 'string')) {
                throw new Error("Each image URL must be a string.");
            }
            return true;
        }),
];

export {validateHandler,registerValidator,createBookValidator}