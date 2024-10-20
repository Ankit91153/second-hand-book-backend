import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Book
export interface IBook extends Document {
    title: string;
    class: mongoose.Types.ObjectId; // Reference to Class schema
    subject: mongoose.Types.ObjectId; // Reference to Subject schema
    author: string;
    price: number;
    seller: mongoose.Types.ObjectId; // Reference to Seller schema
    description: string;
    smallVideo?: string; // Optional
    images?: string[]; // Optional
    bookSold: boolean;
    createdAt: Date;
}

// Create the Book schema
const bookSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    smallVideo: {
        type: String, // URL to a video related to the book (if any)
        required: false,
    },
    images: {
        type: [String], // Array of image URLs
        required: false,
    },
    bookSold: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Book model
const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
