export const getTokenClient = (): string | null => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem("jwt")
}

export const isAuthenticatedClient = (): boolean => {
  return Boolean(getTokenClient())
}