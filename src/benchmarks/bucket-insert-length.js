import Promise from 'bluebird';
import Channel from '../models/channel';
import CommentBucket from '../models/comment-bucket';

// This experiments the use of comment-bucket.comment.length ($size) and findAndModify with sort
// to know the correct bucket to write to
// Result: Worked much better than using channel.buckets to keep track of which comment-bucket to use.
// becuase this is a single locking document operation that are no race conditions

const commentBucketLimit = 3;

const insertCommentPromise = Promise.promisify(insertComment);

function insertComment (channel_id, newComment, callback) {
	CommentBucket.findOneAndUpdate(
		{
			'channel_id': channel_id,
			'count': { $lt: commentBucketLimit },
		},
		{
			'$inc': { 'count': 1 },
			'modifiedAt': new Date(),
			'$push': {
				'comments': {
					author: newComment.author,
					body: newComment.body,
					createdAt: new Date()
				}
			}
		},
		{
			upsert: true ,
			new: true,
			// sort: { 'createdAt': -1 }
			sort: { 'modifiedAt': -1 }
		},
		function(err, commentBucket) {
			callback(err, commentBucket)
		});
}

export default function(channel_id, comment, callback) {
	return insertCommentPromise(channel_id, comment)
		.then((commentBucket) => {

			console.log('commentBucket count ',commentBucket.count);
		});
}
