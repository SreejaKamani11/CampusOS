const AppError = require('../../utils/AppError');
const { hashPassword, comparePassword } = require('../../utils/password');
const {
  signAccessToken,
  createRefreshToken,
  hashToken,
  getRefreshTokenExpiryDate,
} = require('../../utils/jwt');
const authRepository = require('./auth.repository');

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = createRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshTokenExpiryDate();

  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  return { accessToken, refreshToken };
}

async function register({ name, email, password, campus_id }) {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError('Email is already registered', 409, 'EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(password);
  const user = await authRepository.createUser({
    email,
    passwordHash,
    name,
    campusId: campus_id,
  });

  const tokens = await issueTokens(user);

  return {
    user: authRepository.mapPublicUser(user),
    ...tokens,
  };
}

async function login({ email, password }) {
  const user = await authRepository.findUserByEmail(email);

  if (!user || !user.active) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const passwordMatches = await comparePassword(password, user.password_hash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const tokens = await issueTokens(user);

  return {
    user: authRepository.mapPublicUser(user),
    ...tokens,
  };
}

async function getProfile(userId) {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (!user.active) {
    throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED');
  }

  return authRepository.mapPublicUser(user);
}

async function logout({ userId, refreshToken }) {
  const tokenHash = hashToken(refreshToken);
  const storedToken = await authRepository.findRefreshTokenByHash(tokenHash);

  if (!storedToken) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
  }

  if (storedToken.user_id !== userId) {
    throw new AppError('Refresh token does not belong to this user', 403, 'FORBIDDEN');
  }

  await authRepository.deleteRefreshTokenByHash(tokenHash);

  return { message: 'Logged out successfully' };
}

async function refreshToken({ refreshToken }) {
  const tokenHash = hashToken(refreshToken);
  const storedToken = await authRepository.findRefreshTokenByHash(tokenHash);

  if (!storedToken) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_TOKEN');
  }

  const user = await authRepository.findUserById(storedToken.user_id);

  if (!user || !user.active) {
    throw new AppError('User not found or disabled', 401, 'UNAUTHORIZED');
  }

  await authRepository.deleteRefreshTokenById(storedToken.id);
  const tokens = await issueTokens(user);

  return {
    user: authRepository.mapPublicUser(user),
    ...tokens,
  };
}

module.exports = {
  register,
  login,
  getProfile,
  logout,
  refreshToken,
};
