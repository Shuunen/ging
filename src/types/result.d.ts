interface Result<Data = string> {
  success: boolean
  message: string
  data?: Data
}
