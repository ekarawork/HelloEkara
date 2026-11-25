const { user } = require("../../database/models");
const { MAX_LOGIN_ATTEMPTS } = require("../../constants/auth");

// find user by email
const findUserByEmail = async (email) => {
    return await user.findOne({
        where: {
            email,
        },
    });
};

// update last login
const updateLastLogin = async (id) => {
    return await user.update(
        {
            last_login: new Date(),
        },
        {
            where: {
                id,
            },
        }
    );
};

const incrementFailedAttempts = async (user) => {
    return await user.update({
        failed_login_attempts:
            user.failed_login_attempts + 1,
    });
};

const resetFailedAttempts = async (user) => {
    return await user.update({
        failed_login_attempts: 0,
        locked_until: null,
    });
};

const lockAccount = async (user, lockedUntil) => {
    return await user.update({
        failed_login_attempts: MAX_LOGIN_ATTEMPTS,
        locked_until: lockedUntil,
    });
};

const unlockAccountIfExpired = async (user) => {
    if (
        user.locked_until &&
        new Date(user.locked_until) <= new Date()
    ) {
        await user.update({
            failed_login_attempts: 0,
            locked_until: null,
        });
        user.failed_login_attempts = 0;
        user.locked_until = null;
    }
    return user;    
};

module.exports = {
    findUserByEmail,
    updateLastLogin,
    incrementFailedAttempts,
    resetFailedAttempts,
    lockAccount,
    unlockAccountIfExpired,
};