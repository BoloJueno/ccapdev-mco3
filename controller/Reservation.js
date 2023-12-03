import schemas from "../model/schemas.js";
import "dotenv/config";
import mongoose from "mongoose";

async function findAvailSeat(result) {
    const reservations = schemas.reservations;
    let postDate = result.dateVal;
    let postTime = result.timeVal;
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

    const results = await reservations.find({
        seat: result.seatnoVal,
        lab: result.labVal,
        resDate: dateString,
    });

    return results;
}

export default {
    findAvailSeat
};