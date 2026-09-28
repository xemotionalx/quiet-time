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
