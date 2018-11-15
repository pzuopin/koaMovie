const Mongoose = require('mongoose');

const Comment = Mongoose.model('Comment');

exports.save = async (context, next)=>{
    const CommentData = context.request.body.comment;
    if(CommentData.cid){
        let comment = await Comment.findOne({
            _id: CommentData.cid,
        });
        const Reply = {
            from: CommentData.from,
            to: CommentData.tid,
            content: CommentData.content,
        };
        comment.replies.push(Reply);
        await comment.save();
        context.body = {
            success: true,
        };        
    }else{
        let comment = new Comment({
            movie: CommentData.movie,
            from: CommentData.from,
            content: CommentData.content,            
        });
        await comment.save();
        context.body = {
            success: true,
        };
    }
};