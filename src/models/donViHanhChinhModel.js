const toJson = (item) => {
  return {
    id: item.id,
    tenDonVi: item.tenDonVi,
    email: item.email,
    dienThoai: item.dienThoai,
    parentId: item.parentId ?? 0,
    trangThai: item.trangThai
  }
}

const fromJson = (item) => {
  return {
    id: item.id,
    tenDonVi: item.tenDonVi,
    email: item.email,
    dienThoai: item.dienThoai,
    parentId: item.parentId,
    capTren: item.parent,
    trangThai: item.trangThai
  }
}

const baseJson = () => {
  return {
    id: null,
    tenDonVi: null,
    email: null,
    dienThoai: null,
    parentId: 0,
    trangThai: 1
  }
}

export const donViHanhChinhModel = {
  toJson,
  fromJson,
  baseJson
}
