module.exports.config = {
    token: '646214175:AAFHoHLKSvR0A39WGHKsO1cw4gqr3CE-ci0',
    myId: 646214175, // before : in token
    punctuation: {
        endSentence: '.!?',
        all: '.!?;:,'
    },
    db: {
        dialect: 'postgres',
        username: 'shizoid',
        password: 'shizoid',
        database: 'shizoid',
        host: 'localhost',
        port: 5432,
        logging: false
    },
    debug: true
};
