export const REGISTRATION_AVATAR_KEYS = Array.from(
  { length: 12 },
  (_, index) => `asset://images/avatar/avatar_${index + 1}.png`,
)

export const assetKeyToPublicUrl = (assetKey?: string) =>
  assetKey?.startsWith('asset://') ? `/${assetKey.substring('asset://'.length)}` : ''

/**
 * 从官网内置头像中随机选择一个注册头像。
 */
export const randomRegistrationAvatar = () => {
  const index = Math.floor(Math.random() * REGISTRATION_AVATAR_KEYS.length)
  return REGISTRATION_AVATAR_KEYS[index]!
}
