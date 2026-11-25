const { login_logs } = require("../../database/models");

const createLog = async (data) => {
    return await login_logs.create({
        user_id: data.user_id,
        email: data.email,
        ip_address: data.ip_address,
        browser: data.browser,
        platform: data.platform,
        user_agent: data.user_agent,
        status: data.status,
        message: data.message,
    });
};

module.exports = {
    createLog,
};