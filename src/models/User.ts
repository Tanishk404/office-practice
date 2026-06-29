import mongoose from 'mongoose'


interface UserSchemaType {
    email: string
    password: string
}

const UserSchema = new mongoose.Schema<UserSchemaType>({
    email: {
        type: String,
        required: true,
        unique: true,

    }, 

    password: {
        type: String,
        required: true,
        
    }
})


export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)