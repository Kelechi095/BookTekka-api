import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
    },

    author: {
        type: String
    },

    description: {
        type: String
    },

    posterId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
      },

    thumbnail: {
        type: String
    },

    smallThumbnail: {
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

    currentPage: {
        type: Number,
        default: 0
    },

    totalPages: {
        type: Number,
        default: 0
    },

    pagesRemaining: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['Finished', 'Reading', 'Unread'],
        required : true 
    },
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema)

export default Book