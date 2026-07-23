const REGISTRATION_AVATAR_URLS = Array.from(
  { length: 12 },
  (_, index) => `https://www.lvyv.com/images/avatar/avatar_${index + 1}.png`,
)

/**
 * 从官网内置头像中随机选择一个注册头像。
 */
export const randomRegistrationAvatar = () => {
  const index = Math.floor(Math.random() * REGISTRATION_AVATAR_URLS.length)
  return REGISTRATION_AVATAR_URLS[index]!
}
