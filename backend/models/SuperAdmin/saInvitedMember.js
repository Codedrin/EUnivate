import mongoose from 'mongoose';

const saInvitedMemberSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        require:true,
    },
    role: {
        type: String,
        enum: ['User', 'members', 'admin', 'superadmin'],
        default: 'User',
    },      
    project: [{
        type: String,
        ref: 'User', 
    
    }],
    profilePicture: {
        publicId: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    invitedBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
}, {
    timestamps: true,
});

const saInvitedMember = mongoose.model('saInvitedMember', saInvitedMemberSchema);
export default saInvitedMember;