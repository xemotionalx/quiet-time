export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getPasswordError(password: string): string | undefined {
  return password.length >= 8
    ? undefined
    : "Password must be at least 8 characters";
}

export function getConfirmPasswordError(
  password: string,
  confirmPassword: string,
): string | undefined {
  return password === confirmPassword ? undefined : "Passwords do not match";
}

export function getUsernameError(username: string): string | null {
  if (username.length < 3 || username.length > 30) {
    return "Must be 3–30 characters";
  }
  if (!/^[a-z0-9._]+$/.test(username)) {
    return "Only lowercase letters, numbers, periods and underscores";
  }
  if (username.startsWith(".") || username.endsWith(".")) {
    return "Can't start or end with a period";
  }
  if (username.includes("..")) {
    return "Can't have two periods in a row";
  }
  return null;
}

export function getDisplayNameError(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Display name is required";
  }
  if (trimmed.length > 50) {
    return "Must be 50 characters or fewer";
  }
  return null;
}
