const fromJson = (item, idx) => {
  return {
    id: `Node-${idx}`,
    displayName: item.name,
    children: item?.permissions.length === 0
      ? []
      : (item.permissions).map(i => ({
          id: i.id,
          displayName: i.display_name
        }))
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null,
    permissions: []
  }
}

export const moduleModel = {
  fromJson,
  baseJson
}
