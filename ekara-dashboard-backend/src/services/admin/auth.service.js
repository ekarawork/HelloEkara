const ApiError = require("../../utils/ApiError");
const {
    authRepository,
    sessionRepository,
    loginLogRepository,
} = require("../../repositories/index");
const { comparePassword } = require("../../utils/password");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../../utils/jwt");
const { getDeviceInfo } = require("../../utils/device");
const {
    MAX_LOGIN_ATTEMPTS,
    ACCOUNT_LOCK_MINUTES,
    REFRESH_TOKEN_EXPIRES_DAYS,
    REMEMBER_ME_EXPIRES_DAYS,
} = require("../../constants/auth");
const { user: User } = require("../../database/models");

const login = async (req, payload) => {
    const { email, password, remember_me = false } = payload;
    const normalizedEmail = email.trim().toLowerCase();
    const device = getDeviceInfo(req);

    let user = await authRepository.findUserByEmail(normalizedEmail);

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    user = await authRepository.unlockAccountIfExpired(user);

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
        await loginLogRepository.createLog({
            user_id: user.id,
            email: normalizedEmail,
            ip_address: device.ipAddress,
            browser: device.browser,
            platform: device.platform,
            user_agent: device.userAgent,
            status: "ACCOUNT LOCKED",
            message: "Account is locked",
        });

        throw new ApiError(423, "Account is temporarily locked.");
    }

    // Account status check
    if (user.status !== "ACTIVE") {
        await loginLogRepository.createLog({
            user_id: user.id,
            email: normalizedEmail,
            ip_address: device.ipAddress,
            browser: device.browser,
            platform: device.platform,
            user_agent: device.userAgent,
            status: "LOGIN FAILED",
            message: `Account status: ${user.status}`,
        });

        throw new ApiError(403, "Your account is not active.");
    }

    // Password check
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
        const attempts = user.failed_login_attempts + 1;

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            const lockedUntil = new Date(
                Date.now() + ACCOUNT_LOCK_MINUTES * 60 * 1000
            );

            await authRepository.lockAccount(user, lockedUntil);

            await loginLogRepository.createLog({
                user_id: user.id,
                email: normalizedEmail,
                ip_address: device.ipAddress,
                browser: device.browser,
                platform: device.platform,
                user_agent: device.userAgent,
                status: "ACCOUNT LOCKED",
                message: "Maximum login attempts exceeded",
            });

            throw new ApiError(423, "Account locked for 30 minutes.");
        }

        await authRepository.incrementFailedAttempts(user);

        await loginLogRepository.createLog({
            user_id: user.id,
            email: normalizedEmail,
            ip_address: device.ipAddress,
            browser: device.browser,
            platform: device.platform,
            user_agent: device.userAgent,
            status: "LOGIN FAILED",
            message: "Incorrect password",
        });

        throw new ApiError(401, "Invalid email or password.");
    }

    // Successful login
    await authRepository.resetFailedAttempts(user);

    const jwtPayload = {
        id: user.id,
        uuid: user.uuid,
        role: user.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const expiresAt = new Date();
    expiresAt.setDate(
        expiresAt.getDate() +
            (remember_me ? REMEMBER_ME_EXPIRES_DAYS : REFRESH_TOKEN_EXPIRES_DAYS)
    );

    await sessionRepository.createSession({
        user_id: user.id,
        refresh_token: refreshToken,
        device_name: device.deviceName,
        browser: device.browser,
        platform: device.platform,
        ip_address: device.ipAddress,
        user_agent: device.userAgent,
        remember_me,
        expires_at: expiresAt,
    });

    await authRepository.updateLastLogin(user.id);

    await loginLogRepository.createLog({
        user_id: user.id,
        email: normalizedEmail,
        ip_address: device.ipAddress,
        browser: device.browser,
        platform: device.platform,
        user_agent: device.userAgent,
        status: "LOGIN SUCCESS",
        message: "Login successful",
    });

    return {
        user: {
            id: user.id,
            uuid: user.uuid,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

const refreshToken = async (token) => {
    let payload;

    try {
        payload = verifyRefreshToken(token);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const session = await sessionRepository.findByRefreshToken(token);

    if (!session) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    if (new Date(session.expires_at) <= new Date()) {
        await session.destroy();
        throw new ApiError(401, "Refresh token expired.");
    }

    const currentUser = await User.findByPk(session.user_id);

    if (!currentUser) {
        await session.destroy();
        throw new ApiError(401, "User not found.");
    }

    if (currentUser.status !== "ACTIVE") {
        throw new ApiError(403, "Your account is not active.");
    }

    // Make sure token belongs to the same user
    if (Number(payload.id) !== Number(session.user_id)) {
        await session.destroy();
        throw new ApiError(401, "Invalid refresh token.");
    }

    const jwtPayload = {
        id: currentUser.id,
        uuid: currentUser.uuid,
        role: currentUser.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const newRefreshToken = generateRefreshToken(jwtPayload);

    const expiresAt = new Date();
    expiresAt.setDate(
        expiresAt.getDate() +
            (session.remember_me
                ? REMEMBER_ME_EXPIRES_DAYS
                : REFRESH_TOKEN_EXPIRES_DAYS)
    );

    await sessionRepository.updateRefreshToken(
        session,
        newRefreshToken,
        expiresAt
    );

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

const logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required.");
    }

    await sessionRepository.deleteSession(refreshToken);
};

const logoutAll = async (userId) => {
    await sessionRepository.deleteAllSessions(userId);
};

module.exports = {
    login,
    refreshToken,
    logout,
    logoutAll,
};