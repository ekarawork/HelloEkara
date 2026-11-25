const ResponseHelper = require("../../helpers/response.helper");
const asyncHandler = require("../../middleware/asyncHandler");
const { authService } = require("../../services/index");
const {
    loginSchema,
    refreshTokenSchema,
} = require("../../validations/admin/auth.validation");

const login = asyncHandler(async (req, res) => {
    const { error, value } = loginSchema.validate(req.body, {
        abortEarly: true,
    });

    if (error) {
        return ResponseHelper.error(res, error.details[0].message, null, 422);
    }

    const result = await authService.login(req, value);

    return ResponseHelper.success(res, "Login successful.", result, 200);
});

const refreshToken = asyncHandler(async (req, res) => {
    const { error, value } = refreshTokenSchema.validate(req.body, {
        abortEarly: true,
    });

    if (error) {
        return ResponseHelper.error(res, error.details[0].message, null, 422);
    }

    const result = await authService.refreshToken(value.refreshToken);

    return ResponseHelper.success(res, "Token refreshed successfully.", result);
});

const logout = asyncHandler(async (req, res) => {
    const { error, value } = refreshTokenSchema.validate(req.body, {
        abortEarly: true,
    });

    if (error) {
        return ResponseHelper.error(res, error.details[0].message, null, 422);
    }

    await authService.logout(value.refreshToken);

    return ResponseHelper.success(res, "Logout successful.");
});

const logoutAll = asyncHandler(async (req, res) => {
    await authService.logoutAll(req.user.id);

    return ResponseHelper.success(res, "Logged out from all devices.");
});

module.exports = {
    login,
    refreshToken,
    logout,
    logoutAll,
};