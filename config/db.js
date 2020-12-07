const mongoDb = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoDb.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log('Mongo DB connected...');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;