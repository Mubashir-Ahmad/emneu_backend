import mongoose from "mongoose";

const DBconnect = async (DataBase_URL) => {
    try{
        const DB_OPTION={
            dbName:'emenu'
        }
        mongoose.set('strictQuery',true);
        await mongoose.connect(DataBase_URL,DB_OPTION);
        console.log("Database Connected");
    }
    catch(err){
        console.log("db_error",err);
    }
}

export { DBconnect}