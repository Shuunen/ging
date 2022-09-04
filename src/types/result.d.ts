interface Result<T = string> {
  success: boolean
  message: string
  data?: T
}
