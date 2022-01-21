const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const { MY_SALT } = process.env;

const salt = bcrypt.genSaltSync(parseInt(MY_SALT));

const genHash = async (data) => {
    try {
        const res = await bcrypt.hash(data, salt);
        return res;
    } catch (error) {
        return error;
    }
};

module.exports = genHash;
