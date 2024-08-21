const toJson = (item) => {
  return {
    id: item.id,
    userName: item.userName,
    password: item.password,
    fullName: item.fullName,
    image: item.image,
    email: item.email,
    phone: item.phone,
    organizationId: item?.organizationId,
    roles: item.roles,
    status: item.status
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    userName: item.userName,
    fullName: item.fullName,
    image: item.image,
    email: item.email,
    phone: item.phone,
    organizationId: item?.organizationId,
    organization: item?.organization,
    roles: item?.roles ? (item.roles).map(item => item.id) : [],
    status: item.status
  }
}

const fromProfileJson = (item) => {
  return {
    id: item.id,
    userName: item.userName,
    fullName: item.fullName,
    image: item.image,
    email: item.email,
    phone: item.phone,
    organizationId: item?.organizationId,
    organization: item?.organization,
    roles: item?.roles ? (item.roles).map(item => item.name) : [],
    status: item.status
  }
}

const baseJson = () => {
  return {
    id: null,
    userName: null,
    password: null,
    fullName: null,
    image: null,
    email: null,
    phone: null,
    organizationId: null,
    roles: null,
    status: 1
  }
}

export const userModel = {
  toJson, fromJson, baseJson, fromProfileJson
}
