// Helper to access user fields regardless of DbUser (snake_case) vs LegacyUser (camelCase)
export function getUserDisplay(user: Record<string, unknown> | null | undefined) {
  if (!user) return { avatar: undefined, firstName: '', lastName: '' };
  return {
    avatar: (user.avatar as string) ?? (user.avatar_url as string) ?? undefined,
    firstName: (user.firstName as string) ?? (user.first_name as string) ?? '',
    lastName: (user.lastName as string) ?? (user.last_name as string) ?? '',
  };
}
