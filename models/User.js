import mongoose from "mongoose";

const userShema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
userShema.index({ email: 1, username: 1 }, { unique: true })
userShema.statics.findOrCreate = async function(query) {
    try {
        const user = await this.findOne(query);
        if (user) {
            return user;
        }
        const newUser = new this(query);
        await newUser.save();
        return newUser;
    }
    catch (err) {
        console.log(err)
        throw err;
    }
}
export default mongoose.model("User", userShema)