const fromJson = (item) => {
  return {
    id: item.id,
    parentId: null,
    name: 'Dashboard',
    icon: 'string',
    url: '/Auth/Dashboard',
    permissions: [],
    order: 1,
    status: true,
    children: []
  }
}

const baseJson = () => {
  return {
    active: false,
    message: null,
    color: 'info'
  }
}

export const sidebarModel = {
  fromJson, baseJson
}
