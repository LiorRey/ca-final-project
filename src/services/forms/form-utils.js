const strengthLevels = {
  0: {
    message: "Password must have at least 8 characters",
    className: "strength-neutral",
  },
  1: {
    message: "Weak",
    className: "strength-weak",
  },
  2: {
    message: "Fair",
    className: "strength-fair",
  },
  3: {
    message: "Good",
    className: "strength-good",
  },
  4: {
    message: "Strong",
    className: "strength-strong",
  },
  5: {
    message: "Very strong",
    className: "strength-very-strong",
  },
};

/**
 * Calculate password strength based on length and character variety
 * @param {string} password - The password to evaluate
 * @returns {object} Object containing strength score, message, className, and neutral flag
 */
export function calculatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return {
      strength: 0,
      message: strengthLevels[0].message,
      className: strengthLevels[0].className,
      neutral: true,
    };
  }

  const length = password.length;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  let score = 0;
  let criteriaCount = 0;

  if (hasLowercase) criteriaCount++;
  if (hasUppercase) criteriaCount++;
  if (hasDigit) criteriaCount++;
  if (hasSpecialChar) criteriaCount++;

  if (length >= 8 && length < 10) {
    score = criteriaCount < 2 ? 1 : 2;
  } else if (length >= 10 && length < 12) {
    score = criteriaCount < 3 ? 2 : 3;
  } else if (length >= 12 && length < 16) {
    score = criteriaCount < 3 ? 3 : 4;
  } else if (length >= 16) {
    score = criteriaCount === 4 ? 5 : 4;
  }

  const mappedScore = Math.max(0, Math.min(score, 5));
  return {
    strength: mappedScore,
    message: strengthLevels[mappedScore].message,
    className: strengthLevels[mappedScore].className,
    neutral: false,
  };
}

export function getStrengthLevel(level) {
  return strengthLevels[level] || strengthLevels[0];
}
