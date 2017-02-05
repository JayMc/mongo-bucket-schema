import Channel from './models/channel';
import CommentBucket from './models/comment-bucket';
import mongoose from'mongoose';

mongoose.connect('mongodb://localhost/mongo-bucket-schema');

const limitCommentsPerBucket = 3;

// const channel = new Channel({
// 	name: 'test',
// 	num_buckets: 0,
// });
//
// channel.save(function (err, doc) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log('doc',doc);
// 	}
// });


// find the channel
Channel.findOne({
	_id: '58967e51c8a0222b68132f32'
}, function(err, doc) {
	if (err) {
		console.log(err);
	} else {
		console.log('doc',doc);
		insertComment(doc, {
			author: 'Guy',
			body: 'Some message'
		})
	}
})

function insertComment (channel, newComment) {
	CommentBucket.findOneAndUpdate(
		{
			'channel_id': channel._id,
			'bucket': channel.buckets
		},
		{
			'$inc': { 'count': 1 },
			'$push': {
				'comments': {
					author: newComment.author,
					body: newComment.body
				}
			}
		},
		{
			fields: { 'count': 1 },
			upsert: true ,
			new: true
		},
		function (err, doc) {
			if (err) {
				console.log(err);
			} else {
				console.log('doc',doc);
				// update channel bucket count if comment count is now over limit (100)
				if (doc.count > limitCommentsPerBucket) {
					Channel.update({
						'_id': channel._id,
					},
					{
						'$inc': { buckets: 1 }
					},
					function (err, doc) {
						if (err) {
							console.log(err);
						} else {
							console.log('doc',doc);
						}
					})
				}
			}
		});

}
