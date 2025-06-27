export const getImageUrl = (path?: string) => {
  if (!path) return ""
  return path.startsWith("http") ? path : `http://localhost:8080/${path}`
}