import { mongoose } from "mongoose";
const schema = mongoose.Schema;

const blogSchema = new schema({
    title: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true })


export const recipe = mongoose.model('recipe', blogSchema);

