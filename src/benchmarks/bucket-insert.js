import Promise from 'bluebird';
import Channel from '../models/channel';
import CommentBucket from '../models/comment-bucket';

// This uses the channel.buckets to know which bucket to insert the new comment into
// Result: Problem is on a large number of serial writes it doesn't adhear to the comments limit
// some comment sizes are 1 while others are 6. the limit should be 3
// maybe something to do with a race condition updating channel.uckets not fast enough
// this could be fixed if Monog supported transactions.

const findChannelPromise = Promise.promisify(findChannel);
const insertCommentPromise = Promise.promisify(insertComment);
const updateBucketCountPromise = Promise.promisify(updateBucketCount);

// find the channel
function findChannel(_id, callback) {
	Channel.findOne({
		_id: '5896bbd0c8a0222b68134567'
	},
	function(err, doc) {
		return callback(err, doc)
	})
}

function insertComment (channel, newComment, callback) {
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
			fields: { 'count': 1, 'channel_id': 1 },
			upsert: true ,
			new: true
		},
		function(err, commentBucket) {
			callback(err, commentBucket)
		});
}

function updateBucketCount(commentBucket, callback) {
	Channel.update({
		'_id': commentBucket.channel_id,
	},
	{
		'$inc': { 'buckets': 1 }
	},
	function(err, bucket) {
		callback(err, bucket)
	})
}

export default function(channel_id, comment, callback) {
	return findChannelPromise(channel_id)
		.then((channel) => {
			console.log('channel',channel);

			insertCommentPromise(channel, comment)
				.then((commentBucket) => {

					console.log('commentBucket',commentBucket);
					// update channel bucket count if comment count is now over limit (100)
					if (commentBucket.count > 3) {
						updateBucketCountPromise(commentBucket)
							.then((bucket) => {
								console.log('bucket',bucket);
							})
					}
				})
		})
}
