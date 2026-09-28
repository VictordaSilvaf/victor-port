export function can(
  permissions: string[] | undefined,
  required: string | string[],
): boolean {
  if (!permissions || permissions.length === 0) return false
  const needed = Array.isArray(required) ? required : [required]
  return needed.every((permission) => permissions.includes(permission))
}

export function canAny(
  permissions: string[] | undefined,
  required: string[],
): boolean {
  if (!permissions || permissions.length === 0) return false
  return required.some((permission) => permissions.includes(permission))
}
