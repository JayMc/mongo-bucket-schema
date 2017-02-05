import mongoose from'mongoose';
const Schema = mongoose.Schema;
import commentSchema from './comment';

const commentBucketSchema = new Schema({
	channel_id:  String,
	bucket: Number,
	count: Number,
	createdAt: Date,
	comments: [commentSchema]
});

export default mongoose.model('CommentBucket', commentBucketSchema);
