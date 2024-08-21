const toJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    guard_name: item.guard_name,
    permissions: item.permissions
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    guard_name: item.guard_name,
    permissions: item.permissions,
    created_at: item.created_at
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null,
    guard_name: 'api',
    permissions: []
  }
}

export const roleModel = {
  toJson, fromJson, baseJson
}
