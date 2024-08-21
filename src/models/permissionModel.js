const fromJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    displayName: item.display_name
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null,
    displayName: null
  }
}

export const permissionModel = {
  fromJson, baseJson
}
