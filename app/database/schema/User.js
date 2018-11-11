const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const {SALT_WORK_FACTOR, MAX_LOGIN_ATTEMPTS, LOCK_TIME} = require('../../../config');

const Schema = Mongoose.Schema;
const UserSchema = new Schema({
    role: {
        type: String,
        default: 'user',
    },
    openid: [String],
    unionid: String,
    nickname: String,
    address: String,
    province: String,
    country: String,
    city: String,
    gender: String,
    email: String,
    password: String,
    loginAttempts: {
        type: Number,
        required: true,
        default: 0,
    },
    lockUntil: Number,
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

UserSchema.virtual('isLocked').get(()=>{
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
}); 

UserSchema.pre('save', (next)=>{
    let user = this;
    if(!user.isModified('password')){
        return next();
    }
    Bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
        if(err){
            return next(err);
        }
        Bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods = {
    comparePassword(_password, password){
        return new Promise((resolve, reject)=>{
            Bcrypt.compare(_password, password, (err, isMatch)=>{
                if(!err){
                    return resolve(isMatch);
                }else{
                    return reject(err);
                }
            });
        });
    },
    incLoginAttempts(user){
        let that = user;
        return new Promise((resolve, reject)=>{
            if(that.lockUntil && that.lockUntil < Date.now()){
                that.update({
                    $set: {
                        loginAttempts: 1,
                    },
                    $unset: {
                        lockUntil: 1,
                    },
                }, (err)=>{
                    if(!err){
                        resolve(true);
                    }else{
                        reject(err);
                    }
                });
            }else{
                let updates = {
                    $inc: {
                        loginAttempts: 1,
                    },
                };
                if(that.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS || !that.isLocked){
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME,
                    };
                }
                that.update(updates, err=>{
                    if(!err){
                        resolve(true);
                    }else{
                        reject(err);
                    }
                });
            }
        });
    }
};

Mongoose.model('User', TokenSchema, 'users');