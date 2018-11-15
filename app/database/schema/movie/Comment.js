const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
    movie: {
        type: ObjectId,
        ref: 'Movie',
    },
    from: {
        type: ObjectId,
        ref: 'User',
    },
    content: String,
    replies: [
        {
            from: {
                type: ObjectId,
                ref: 'User',
            },
            to: {
                type: ObjectId,
                ref: 'User',
            },
            content: String,
        },
    ],
    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },
    },
});

CommentSchema.pre('save', function(next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.meta.updatedAt = Date.now();
    }
    next();
});

Mongoose.model('Comment', CommentSchema, 'comments');