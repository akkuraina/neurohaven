import jwt from "jsonwebtoken";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }
  return "development-only-jwt-secret-min-40-chars-change-me!!";
}

export function signJwt(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    getSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export function verifyJwt(token) {
  return jwt.verify(token, getSecret());
}
