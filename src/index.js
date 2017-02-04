import Channel from './models/channel';
import mongoose from'mongoose';

mongoose.connect('mongodb://localhost/mongo-bucket-schema');

const channel = new Channel({
	name: 'test',
	num_buckets: 0,
});

channel.save(function (err, doc) {
	if (err) {
		console.log(err);
	} else {
		console.log('doc',doc);
	}
});
