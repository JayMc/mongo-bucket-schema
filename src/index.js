import mongoose from'mongoose';
import Promise from 'bluebird';
import Channel from './models/channel';
import CommentBucket from './models/comment-bucket';
import bucketInsert from './benchmarks/bucket-insert';
import bucketInsertLength from './benchmarks/bucket-insert-length';

mongoose.connect('mongodb://localhost/mongo-bucket-schema');

const bucketInsertPromise = Promise.promisify(bucketInsert);

const loop = Promise.coroutine(function* () {
	for (var i = 0; i < 1000; i++) {
		try {
			console.time('test')
			// yield bucketInsert('58967e51c8a0222b68132f32', {
			// 	author: 'Guy',
			// 	body: `Some message ${i}`
			// })
			yield bucketInsertLength('58967e51c8a0222b68132f32', {
				author: 'Guy',
				body: `Some message ${i}`
			})
			console.timeEnd('test')
		} catch (err) {
			console.log('err',err);
		}

	}
})

loop()
