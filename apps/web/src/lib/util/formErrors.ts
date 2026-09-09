export const groupErrorMessages = (errors: { field: string; message: string }[]) => {
  const groupedErrors = Object.groupBy(errors, (error) => error.field)
  const errorMessagesByField: Record<string, string[]> = {}
  for (const [key, errors] of Object.entries(groupedErrors)) {
    if (errors) {
      errorMessagesByField[key] = []
      for (const error of errors) {
        errorMessagesByField[key] = [...errorMessagesByField[key], error.message]
      }
    }
  }
  return errorMessagesByField
}
