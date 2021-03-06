import connect from 'connect-session-sequelize';
import session from 'express-session';
import dbInstance from './instantiate_sequalize';
const SequelizeStore = connect(session.Store);

const sessionStore = new SequelizeStore({
    db:dbInstance,
    checkExpirationInterval:15*60*1000,
    expiration:1000*60*60
});

export default sessionStore;