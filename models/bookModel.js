import mongoose from "mongoose";

//IT is actually a book schema

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
    },

    author: {
        type: String
    },

    read: {
        type: String,
        enum: ['finished', 'reading', 'unread'],
        required : true 
    },

    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema)

export default Book