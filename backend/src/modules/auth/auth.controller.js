const asyncHandler = require('../../utils/asyncHandler');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout({
    userId: req.user.id,
    refreshToken: req.body.refreshToken,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  getMe,
  logout,
};
