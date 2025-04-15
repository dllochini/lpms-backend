import mongoose from "mongoose";

const mongodbConnection = async (uri, dbName) => {
    try {
        if (mongoose.connection.readyState === 1) return mongoose; // already connected

        await mongoose.connect(uri, {
            dbName,
            ssl: true,
            maxPoolSize: 10,
        });
        return mongoose;
    } catch (error) {
        console.log(error);
    }
}

export default mongodbConnection;