export const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      // Matches: username@domain.tld (case-insensitive)
      // Allows: letters, numbers, dots, underscores, percent, plus, hyphen
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },

  password: {
    login: {
      required: "Password is required",
    },
    signup: {
      required: "Password must have at least 8 characters",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
    },
  },

  fullName: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
  },
};
