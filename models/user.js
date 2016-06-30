const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Define model

const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// On Save Hook, encrypt password

//Before saving any data run this function. DO NOT USE FAT ARROW
userSchema.pre('save', function(next) {
    //Get access to data, which in this case is 'this'
    const user = this;

    //Generate salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        //Once salt is created, hash password using salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            //Overwrite plain password with hashed password
            //The hashed password contains both the salt AND the hashed password
            user.password = hash;
            next();
        });
    });
});

// Assign a comparePassword method to the models methods collection
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    // this.password wii refer to the user instance
    bcrypt.compare(candidatePassword, this.password, (err, match) => {
        if(err) {
            return callback(err);
        }

        callback(null, match);
    });
};

// Create model class

const UserModel = mongoose.model('user', userSchema);

// Export model

module.exports = UserModel;