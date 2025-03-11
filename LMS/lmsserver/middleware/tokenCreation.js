const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' }).parsed;


createToken = (email, role_id, id) => {
    const token = jwt.sign
        (
            { email, role_id, id },
            process.env.JWT_SECRET,
            // { expiresIn: '1h' }
        );
    return token;
}


module.exports = createToken
