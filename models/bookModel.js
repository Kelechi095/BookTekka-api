import mongoose from "mongoose";

//IT is actually a book schema

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
    },

    author: {
        type: String
    },

    genre: {
        type: String,
        enum: ['African Literature', 'Fantasy', 'Horror', 'Literary Fiction', 'Mystery', 'Non Fiction', 'Romance',  'Science Fiction', 'Thriller', 'Young Adult', 'Others']
    },

    progress: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['Finished', 'Reading', 'Unread'],
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