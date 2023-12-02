import express from "express";
import exphbs from "express-handlebars";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import controller from "./controller/Controller.js";
import Reservation from "./controller/Reservation.js";
// import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import path from 'path';
import multer from 'multer';
import {fileURLToPath} from 'url';
import session from "express-session";
import { profile } from "console";
import Controller from "./controller/Controller.js";
//import cookieSession from "cookie-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './public/images';

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage: storage});

app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.static('public'));

app.use(session({ 
    secret: 'Ccapdev2324!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: null
    } 
    }));

app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    extname: 'hbs',
    defaultLayout: 'indexLayout',
    partialsDir: `${__dirname}/views/partials`,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

const routes = express.Router();

routes.route("/").get(async (req, res, next) => {

    try {
        const reservationsData = await controller.aggregateReservations();
        
        if (req.session.user) {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: 0, 
                session: req.session.user,
                sessionIDno: req.session.user.IDno,
                sessionID: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: 0
            });
        }
        
    } catch (error) {
        next(error); // Handle the error or pass it to the error-handling middleware
    }
});

routes.route("/index/:id").get(async (req, res, next) => {

    let userType;

    if (req.params.id == 'Student') {
        userType = 1;
    } else if (req.params.id == 'Lab Technician') {
        userType = 2;
    } else {
        userType = req.params.id
    }

    try {
        const reservationsData = await controller.aggregateReservations();

        if (req.session.user) {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: userType, 
                sessionIDno: req.session.user.IDno,
                session: req.session.user,
                sessionID: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: userType
            });
        }
    } catch (error) {
        next(error);
    }
});

routes.route("/index/:id/deleted/:isDeleted").get(async (req, res, next) => {

    try {
        const reservationsData = await controller.aggregateReservations(); 

        if (req.session.user) {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: req.params.id, 
                isDeleted: req.params.isDeleted, 
                sessionIDno: req.session.user.IDno,
                session: req.session.user,
                sessionID: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: req.params.id, 
                isDeleted: req.params.isDeleted
            });
        }
    } catch (error) {
        next(error);
    }
});

routes.route("/index/:id/edited/:isEdited").get(async (req, res, next) => {

    try {
        const reservationsData = await controller.aggregateReservations();
        
        if (req.session.user) {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: req.params.id, 
                isEdited: req.params.isEdited, 
                sessionIDno: req.session.user.IDno,
                session: req.session.user,
                sessionID: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: req.params.id, 
                isEdited: req.params.isEdited
            });
        }
    } catch (error) {
        next(error);
    }
});

routes.route("/index/:id/created/:isCreated").get(async (req, res, next) => {

    try {
        const reservationsData = await controller.aggregateReservations();
        
        if (req.session.user) {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: req.params.id, 
                isCreated: req.params.isCreated, 
                sessionIDno: req.session.user.IDno,
                session: req.session.user,
                sessionID: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName
            });
        } else {
            res.render('index', { 
                layout: 'indexLayout', 
                data: reservationsData, 
                user: req.params.id, 
                isCreated: req.params.isCreated
            });
        }
    } catch (error) {
        next(error);
    }
});

routes.route("/login").get(function (req, res) {
    res.render('login', { layout: 'loginLayout'});
});

routes.route("/logout").get(function (req, res) {
    // Log session information
    console.log('Session before logout:', req.session);

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.clearCookie('user');
            res.redirect('/login');
        }
    });
});

routes.route("/login/failed").get(function (req, res) {
    res.render('login', { layout: 'loginLayout', logInFail: true});
});

routes.route("/register2").get(function (req, res) {
    res.render('register2', { layout: 'register2Layout'});
});

routes.route("/profile/:id").get(async (req, res, next) => {
    let id = req.params.id;

    controller.getProfile(req, res, id);
});

routes.route("/results").get(async (req, res) =>{

    let query = req.query.searchInput;

    const result = await controller.searchProfile(query)
    
    if (req.session.user) {
        res.render('results', { 
            layout: 'resultsLayout', 
            data: result,
            enteredQuery: query,
            user: req.session.user.type,
            session: req.session.user,
            firstName: req.session.user.firstName,
            lastName: req.session.user.lastName
        });

    } else {
        res.render('results', { 
            layout: 'resultsLayout',
            data: result,
            enteredQuery: query
        });
    }
});

//=========================posts=================================

routes.route("/login").post(async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let rememberMeBox = req.body.rememberMeBox;

    console.log('Remember value', rememberMeBox);

    let user = await controller.findProfile(email, password);

    if (user) {
        req.session.user = user;
        req.session.authorized = true;

        req.session.cookie.maxAge = rememberMeBox === 'on' ? 21 * 24 * 60 * 60 * 1000 : null;

        // see expiration time
        const expirationTime = new Date(Date.now() + req.session.cookie.maxAge);
        console.log('Session expiration time:', expirationTime);

          let userType = req.session.user.type === 'Student' ? 1 : 2;
          res.redirect(`/index/${userType}`);
        } else {
          res.redirect(`/login/failed`);
    }
});



//=========================posts=================================

//=========================CRUD=================================

//check reservations index
routes.route("/getReservations").get(async(req, res) => {
    const results = await controller.aggregateReservations()
    res.json({results});
});

//check Avail Seat index
routes.route("/checkSeatAvail").get(async(req, res) => {
    const result = req.query
    const exists = await Reservation.findAvailSeat(result);
    res.json({exists});
});

routes.route("/checkIDno").get(async(req, res) => {
    const result = req.query
    const exists = await Controller.findIDno(result);
    res.json({exists});
});

//delete reservations index
routes.route("/index/delete/:id").get(function(req, res) {
    let id = req.params.id;

    controller.deteleById(id, res);

});

//delete reservations profile
routes.route("/profile/delete/:id/:profile").get(function(req, res) {
    let id = req.params.id;
    let profileId = req.params.profile;

    controller.deteleByIdProfile(id, res, profileId);

});

//edit reservations
routes.route("/index/edit/:id").post(function(req, res) {
    let id = req.params.id;
    let postDate = req.body.editDateForm;
    let postTime = req.body.editTimeForm;
    let dateString;

    //year month
    switch(postDate.split(' ')[0]) {
        case 'Jan':
            dateString = '2023-01-';
            break;
        case 'Feb':
            dateString = '2023-02-';
            break;
        case 'Mar':
            dateString = '2023-03-';
            break;
        case 'Apr':
            dateString = '2023-04-';
            break;
        case 'May':
            dateString = '2023-05-';
            break;
        case 'Jun':
            dateString = '2023-06-';
            break;
        case 'Jul':
            dateString = '2023-07-';
            break;
        case 'Aug':
            dateString = '2023-08-';
            break;
        case 'Sep':
            dateString = '2023-09-';
            break;
        case 'Oct':
            dateString = '2023-10-';
            break;
        case 'Nov':
            dateString = '2023-11-';
            break;
        case 'Dec':
            dateString = '2023-12-';
            break;
    }

    //day
    if (postDate.split(' ')[1].slice(0, -1) <= 9) {
        dateString = dateString + "0" + postDate.split(' ')[1].slice(0, -1) + "T";
    } else {
        dateString = dateString + postDate.split(' ')[1].slice(0, -1)  + "T";
    }

    //time
    if (postTime.split(':')[0] <= 9) {
        dateString = dateString + "0" + postTime.split(':')[0] + ":";
    } else {
        dateString = dateString + postTime.split(':')[0] + ":";
    }

    dateString = dateString + postTime.split(':')[1] + ":00.000+08:00";
    
    controller.updateReservation(id, req, res, dateString);

});

//edit profile reservations 
routes.route("/profile/edit/:id/:profile").post(function(req, res) {
    let id = req.params.id;
    let profileId = req.params.profile;
    let postDate = req.body.editDateForm;
    let postTime = req.body.editTimeForm;
    let dateString;

    //year month
    switch(postDate.split(' ')[0]) {
        case 'Jan':
            dateString = '2023-01-';
            break;
        case 'Feb':
            dateString = '2023-02-';
            break;
        case 'Mar':
            dateString = '2023-03-';
            break;
        case 'Apr':
            dateString = '2023-04-';
            break;
        case 'May':
            dateString = '2023-05-';
            break;
        case 'Jun':
            dateString = '2023-06-';
            break;
        case 'Jul':
            dateString = '2023-07-';
            break;
        case 'Aug':
            dateString = '2023-08-';
            break;
        case 'Sep':
            dateString = '2023-09-';
            break;
        case 'Oct':
            dateString = '2023-10-';
            break;
        case 'Nov':
            dateString = '2023-11-';
            break;
        case 'Dec':
            dateString = '2023-12-';
            break;
    }

    //day
    if (postDate.split(' ')[1].slice(0, -1) <= 9) {
        dateString = dateString + "0" + postDate.split(' ')[1].slice(0, -1) + "T";
    } else {
        dateString = dateString + postDate.split(' ')[1].slice(0, -1)  + "T";
    }

    //time
    if (postTime.split(':')[0] <= 9) {
        dateString = dateString + "0" + postTime.split(':')[0] + ":";
    } else {
        dateString = dateString + postTime.split(':')[0] + ":";
    }

    dateString = dateString + postTime.split(':')[1] + ":00.000+08:00";
    
    controller.profileUpdateReservation(id, req, res, dateString, profileId);

});

//create reservations
routes.route("/create").post(async(req, res, next) => {
    let data = req.body.GLOBAL_selectedSeats;
    let currMax;
    let currReservations = [];

    //get groupID
    try {
        currMax = await controller.getMaxID()
    } catch (error) {
        next(error);
    }

    //iterates through the array 
    for (var i = 0; i < data.length; i++) {
        let seat = data[i].split('_')[3];
        let lab = data[i].split('_')[2];
        let postDate = data[i].split('_')[0];
        let postTime = data[i].split('_')[1];
        let dateString;
        let anon = data[i].split('_')[4];
        let stud;

        if (req.session.user.type == 'Lab Technician') {
            stud = data[i].split('_')[5];
        }

        //year month
        switch(postDate.substr(0, 3)) {
            case 'Jan':
                dateString = '2023-01-';
                break;
            case 'Feb':
                dateString = '2023-02-';
                break;
            case 'Mar':
                dateString = '2023-03-';
                break;
            case 'Apr':
                dateString = '2023-04-';
                break;
            case 'May':
                dateString = '2023-05-';
                break;
            case 'Jun':
                dateString = '2023-06-';
                break;
            case 'Jul':
                dateString = '2023-07-';
                break;
            case 'Aug':
                dateString = '2023-08-';
                break;
            case 'Sep':
                dateString = '2023-09-';
                break;
            case 'Oct':
                dateString = '2023-10-';
                break;
            case 'Nov':
                dateString = '2023-11-';
                break;
            case 'Dec':
                dateString = '2023-12-';
                break;
        }

        //day
        if (postDate.slice(3).split(',')[0] <= 9) {
            dateString = dateString + "0" + postDate.slice(3).split(',')[0] + "T";
        } else {
            dateString = dateString + postDate.slice(3).split(',')[0]  + "T";
        }
        
        //time
        if (postTime.split(':')[0] <= 9) {
            dateString = dateString + "0" + postTime.split(':')[0] + ":";
        } else {
            dateString = dateString + postTime.split(':')[0] + ":";
        }

        dateString = dateString + postTime.split(':')[1] + ":00.000+08:00";
        
        try {
            if (req.session.user.type == 'Lab Technician') {
                currReservations[i] = {
                    groupID: currMax[0].maxField + 1,
                    seat: seat,
                    lab: lab,
                    resDate: dateString,
                    user: req.session.user._id,
                    anon: anon,
                    reservedStud: stud
                };
            } else {
                currReservations[i] = {
                    groupID: currMax[0].maxField + 1,
                    seat: seat,
                    lab: lab,
                    resDate: dateString,
                    user: req.session.user._id,
                    anon: anon
                };
            }
        } catch {
            if (req.session.user.type == 'Lab Technician') {
                currReservations[i] = {
                    groupID: 1,
                    seat: seat,
                    lab: lab,
                    resDate: dateString,
                    user: req.session.user._id,
                    anon: anon,
                    reservedStud: stud
                };
            } else {
                currReservations[i] = {
                    groupID: 1,
                    seat: seat,
                    lab: lab,
                    resDate: dateString,
                    user: req.session.user._id,
                    anon: anon
                };
            }
        }
        
    }//for loop

    controller.createReservations(req, res, currReservations)

});

//create an account
routes.route("/register2").post(async (req, res, next) => {

    let IDnum;
    try {
        IDnum = await controller.profGetMaxID()
    } catch (error) {
        next(error);
    }

    let regProfile = {
        type: req.body.type,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        img: "https://iabc.bc.ca/wp-content/uploads/2018/05/unknown_profile.png",
        email: req.body.email,
        password: req.body.password,
        rem: true,
        IDno: IDnum[0].maxField + 1,
    }

    await controller.createProfile(req, res, regProfile);
});

//edit a profile
routes.route("/editProfile/:id")
    .post(upload.single('image'), async (req, res, next) => {
        const id = req.params.id;
        controller.editProfileDesc(id, req.body.editProfileDesc, req.file, () => {
            console.log('File uploaded');
            res.redirect(`/profile/${id}`);
        });
    });


//delete profile
routes.route("/deleteProfile/:id").post(async (req, res, next) =>{
    controller.deleteProfile(req.params.id, res);
});

app.use(routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`App Started on Port ${process.env.SERVER_PORT}`);
    mongoose.connect(process.env.MONGODB_URI, {dbName: process.env.DB_NAME});
});
