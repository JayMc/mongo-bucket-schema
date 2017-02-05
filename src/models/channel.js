import mongoose from'mongoose';
const Schema = mongoose.Schema;

const channelSchema = new Schema({
	name:  String,
	buckets: Number,
	createdAt: Date
});

export default mongoose.model('Channel', channelSchema);
