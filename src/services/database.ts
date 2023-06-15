import { connect } from "mongoose";
import { MONGO_URL } from '@/config';

export async function connectDB() {
    try {
        await connect(MONGO_URL);
    } catch (error) {
        console.log(error);
    }
}