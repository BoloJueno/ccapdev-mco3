import schemas from "../model/schemas.js";
import "dotenv/config";
import mongoose from "mongoose";
import crypto from 'crypto';

function hashPassword(password, salt, callback) {
    const iterations = 10000;
    const hashBytes = 64;
    const digest = 'sha512';

    if (callback && typeof callback === 'function') {
        crypto.pbkdf2(password, salt, iterations, hashBytes, digest, (err, derivedKey) => {
            if (err) throw err;
            callback(derivedKey.toString('hex'));
        });
    } else {
        const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, hashBytes, digest);
        return derivedKey.toString('hex');
    }
}



async function aggregateReservations() {
    let reservations = schemas.reservations;

    const results = await reservations.aggregate([
        {
            $lookup: {
                from: "profiles",
                localField: "user",
                foreignField: "_id",
                as: "reservee"
            }
        },
        {
            $lookup: {
                from: "profiles",
                localField: "reservedStud",
                foreignField: "IDno",
                as: "studReservee"
            }
        }
    ]);

    return results;
}

async function getMaxID() {
    let reservations = schemas.reservations;

    const results = reservations.aggregate([
        {
            $group: {
                _id: null,
                maxField: { $max: "$groupID" }
                }
        }
    ]);

    return results;
}

async function deteleById(id, res) {
    let reservations = schemas.reservations;

    reservations.findByIdAndDelete(id)
    .then(result => {
        res.redirect("/index/2/deleted/true");
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
}

async function deteleByIdProfile(id, res, profileId) {
    let reservations = schemas.reservations;

    reservations.findByIdAndDelete(id)
    .then(result => {
        res.redirect(`/profile/${profileId}`);
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
}

async function updateReservation(id, req, res, dateString) {
    let reservations = schemas.reservations;

    reservations.findByIdAndUpdate(id, {
        seat: req.body.seatNo,
        lab: req.body.editLabForm,
        resDate: dateString
    })
    .then(result => {
        res.redirect("/index/2/edited/true");
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
}

async function profileUpdateReservation(id, req, res, dateString, profileId) {
    let reservations = schemas.reservations;

    reservations.findByIdAndUpdate(id, {
        seat: req.body.seatNo,
        lab: req.body.editLabForm,
        resDate: dateString
    })
    .then(result => {
        res.redirect(`/profile/${profileId}`);
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
}

async function createReservations(req, res, currReservations) {
    let reservations = schemas.reservations;

    reservations.insertMany(currReservations)
    .then(result => {
        res.redirect(`/index/1/created/true`);
    })
    .catch(err => {
        return res.status(500).json({ message: err.message });
    });
}

async function createProfile(req, res, regProfile) {
    let profiles = schemas.profile;

    const salt = crypto.randomBytes(16).toString('hex');

    
    hashPassword(regProfile.password, salt, (hashedPassword) => {
        
        regProfile.salt = salt;
        regProfile.hashedPassword = hashedPassword;

        profiles.create(regProfile)
            .then(result => {
                res.redirect(`/login`);
            })
            .catch(err => {
                return res.status(500).json({ message: err.message });
            });
    });
    
}

async function getProfile(req, res, id) {
    let profiles = schemas.profile;
    let reservations = schemas.reservations;
    
    const results = await reservations.aggregate([
        {
            $lookup: {
                from: "profiles",
                localField: "user",
                foreignField: "_id",
                as: "reservee"
            }
        },
        {
            $match: {
                "reservee._id": new mongoose.Types.ObjectId(id)
            }
        },
        {
            $group: {
                _id: "$groupID",
                reservations: { $push: "$$ROOT" }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);

    profiles.findById(id).then((profileData) => {
        
        if (req.session.user) {
            res.render('profile', { 
                layout: 'profileLayout', 
                data:profileData, 
                session: req.session.user,
                user: req.session.user.type,
                result: results,
                sessionID: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.render('profile', { 
                layout: 'profileLayout', 
                data:profileData,
                result: results
            });
        }
    });
}

async function searchProfile(query) {
    let profiles = schemas.profile;

    const result = await profiles.find({ 
        $or: [
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } }
        ]
    });

    return result;
}

async function findProfile(email, password) {
    try {
        const Profile = schemas.profile;
        const user = await Profile.findOne({ email: email });

        if (user && user.salt) {
            const hashedPassword = hashPassword(password, user.salt);
            if (hashedPassword === user.hashedPassword) {
                return user;
            }
        }

        return null;
    } catch (error) {
        console.error('Error finding user profile:', error);
        throw error;
    }
}

async function profGetMaxID() {
    let profiles = schemas.profile;

    const results = profiles.aggregate([
        {
            $group: {
                _id: null,
                maxField: { $max: "$IDno" }
                }
        }
    ]);

    return results;
}

async function editProfileDesc(id, bio, file, callback) {
    try {
        let profiles = schemas.profile;

        // Update the profile description
        const updatedProfile = await profiles.findByIdAndUpdate(id, { bio: bio });

        console.log('Profile updated successfully:', updatedProfile);

        // Update the user image
        const user = await profiles.findById(id);

        if (file) {
            const imageUrl = `../images/${file.filename}`;
            user.img = imageUrl;

            console.log(user.img);

            await user.save();
            console.log('User saved successfully');
        }

        // Invoke the callback
        if (callback && typeof callback === 'function') {
            callback();
        }

    } catch (error) {
        console.error('Error updating profile or saving user:', error);
    }
}



async function deleteProfile(id, res) {
    try {
        const reservations = schemas.reservations;
        const profile = schemas.profile;

        await reservations.deleteMany({ user: new mongoose.Types.ObjectId(id) });

        const deletedProfile = await profile.findByIdAndDelete(id);

        if (deletedProfile) {
            res.redirect('/login');
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        console.error('Error deleting profile:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function findIDno(result) {
    const profiles = schemas.profile;

    const results = await profiles.find({
        IDno: result.IDNo
    });

    return results;
}

export default {
    aggregateReservations, 
    getMaxID, 
    deteleById, 
    updateReservation, 
    createReservations, 
    createProfile,
    getProfile,
    searchProfile,
    findProfile,
    profGetMaxID,
    deteleByIdProfile,
    editProfileDesc,
    deleteProfile,
    profileUpdateReservation,
    findIDno
};