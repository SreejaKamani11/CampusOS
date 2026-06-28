const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/jwt');
const authRepository = require('../modules/auth/auth.repository');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = header.slice(7);

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Access token expired', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Invalid access token', 401, 'INVALID_TOKEN');
    }

    const user = await authRepository.findUserById(payload.sub);

    if (!user) {
      throw new AppError('User not found', 401, 'UNAUTHORIZED');
    }

    if (!user.active) {
      throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED');
    }

    req.user = authRepository.mapPublicUser(user);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;
