import mongoose from "mongoose";
const {Schema, model} = mongoose;

const profileSchema = new Schema ({
    IDno: {type:Number},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    img: {type:String, required:true},
    type: {type:String, required:true, enum:['Student', 'Lab Technician']},
    bio: {type:String},
    email: {type:String, required:true},
    salt: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    rem: {type:Boolean, required:true},
    lastLogin: {type:Date, default:Date.now}
});

const reservationsSchema = new Schema ({
    groupID: {type:Number},
    seat: {type:String, required:true},
    lab: {type:String, required:true, enum:['GK101A', 'GK304A', 'GK304B', 'AG702', 'AG1904', 'LS209', 'LS311']},
    reqDate: {type:Date, required:true, default:Date.now},
    resDate: {type:Date, required:true},
    anon: {type:Boolean, required:true},
    user: {type:Schema.Types.ObjectId, ref:'profile'},
    reservedStud: {type:Number}
});

const Profile = model("Profile", profileSchema);
const Reservations = model("Reservations", reservationsSchema);

const schemas = {'profile':Profile, 'reservations':Reservations};

export default schemas;