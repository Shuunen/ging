interface Result<Data = string> {
  data?: Data
  message: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  success: boolean
}
