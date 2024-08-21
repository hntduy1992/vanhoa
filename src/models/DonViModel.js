const toJson = (item) => {
  return {
    id: item.id,
    ten: item.name
  }
}
const fromJson = (item) => {
  return {
    id: item.id,
    name: item.ten
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null
  }
}

export const donViModel = {
  toJson, fromJson, baseJson
}
