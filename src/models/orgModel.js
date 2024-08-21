const toJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    provinceId: item?.province?.id,
    districtId: item?.district?.id,
    wardId: item?.ward?.id,
    parentId: item.parentId ?? 0,
    status: item.status
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    province: item.province,
    district: item.district,
    ward: item.ward,
    parent: item.parent,
    parentId: item.parentId ?? 0,
    status: item.status
  }
}

const baseJson = () => {
  return {
    id: null,
    name: null,
    email: null,
    phone: null,
    province: null,
    district: null,
    ward: null,
    parent: null,
    manages: [],
    status: 1
  }
}

export const orgModel = {
  toJson,
  fromJson,
  baseJson
}
