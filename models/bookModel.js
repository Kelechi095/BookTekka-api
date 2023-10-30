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
        enum: ['African Literature', 'Fantasy', 'Horror', 'Mystery', 'Non fiction', 'Romance',  'Science fiction', 'Thriller', 'Young Adult',]
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