const crypto = require("crypto");
const { user_sessions } = require("../../database/models");

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const createSession = async (data) => {
    return await user_sessions.create({
        user_id: data.user_id,
        refresh_token: hashToken(data.refresh_token),
        device_name: data.device_name,
        browser: data.browser,
        platform: data.platform,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        remember_me: data.remember_me,
        expires_at: data.expires_at,
        last_activity: new Date(),
    });
};

const updateSessionToken = async (
    sessionId,
    refreshToken,
    expiresAt
) => {
    return await user_sessions.update(
        {
            refresh_token: hashToken(refreshToken),
            expires_at: expiresAt,
            last_activity: new Date(),
        },
        {
            where: {
                id: sessionId,
            },
        }
    );
};

const findSession = async (refreshToken) => {
    return await user_sessions.findOne({
        where: {
            refresh_token: hashToken(refreshToken),
        },
    });
};

const deleteSession = async (refreshToken) => {
    return await user_sessions.destroy({
        where: {
            refresh_token: hashToken(refreshToken),
        },
    });
};

const deleteAllSessions = async (userId) => {
    return await user_sessions.destroy({
        where: {
            user_id: userId,
        },
    });
};

const findByRefreshToken = async (token) => {
    return await user_sessions.findOne({
        where: {
            refresh_token: hashToken(token),
        },
    });
};

const updateRefreshToken = async (
    session,
    refreshToken,
    expiresAt
) => {
    return await session.update({
        refresh_token: hashToken(refreshToken),
        expires_at: expiresAt,
        last_activity: new Date(),
    });
};

const updateLastActivity = async (session) => {
    return await session.update({
        last_activity: new Date(),
    });
};

module.exports = {
    hashToken,
    createSession,
    updateSessionToken,
    findSession,
    deleteSession,
    deleteAllSessions,
    findByRefreshToken,
    updateRefreshToken,
    updateLastActivity,
};