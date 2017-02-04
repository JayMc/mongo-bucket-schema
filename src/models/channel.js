import mongoose from'mongoose';
const Schema = mongoose.Schema;

const channelSchema = new Schema({
	name:  String,
	num_buckets: Number
});

export default mongoose.model('channel', channelSchema);
