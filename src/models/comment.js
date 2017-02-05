import mongoose from'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: String,
	body: String,
	createdAt: Date,
});

export default commentSchema;
