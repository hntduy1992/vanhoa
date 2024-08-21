const fromJson = (item) => {
  return {
    active: true,
    message: item.message,
    color: !item.success ? 'red' : 'success'
  }
}

const baseJson = () => {
  return {
    active: false,
    message: null,
    color: 'info'
  }
}

export const snackbarModel = {
  fromJson, baseJson
}
