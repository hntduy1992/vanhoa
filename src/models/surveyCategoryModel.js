const toJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    year: item.year,
    status: item.status
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    year: item.year,
    status: item.status
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null,
    description: null,
    year: null,
    status: 1
  }
}

export const surveyCategoryModel = {
  toJson, fromJson, baseJson
}
