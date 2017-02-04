import mongoose from'mongoose';
const Schema = mongoose.Schema;
import commentSchema from './comment';

const commentBucketSchema = new Schema({
	channel_id:  String,
	bucket: Number,
	count: Number,
	createdAt: Date
	items: [commentSchema]
});

export default mongoose.model('CommentBucket', commentBucketSchema);
