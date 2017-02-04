import mongoose from'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: String,
	text: String,
	createdAt: Date
});

export default commentSchema;
