import schemas from "../model/schemas.js";
import "dotenv/config";
import mongoose from "mongoose";

async function findAvailSeat(result) {
    const reservations = schemas.reservations;

    const results = await reservations.find({
        seat: result.seatnoVal,
        lab: result.labVal
    });

    return results;
}

export default {
    findAvailSeat
};