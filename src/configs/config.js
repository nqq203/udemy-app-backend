const config = {
    DB: {
        dbname: process.env.MONGO_DBNAME,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
        host: process.env.MONGO_HOST,
    },
};

module.exports = config;