const toJson = (item) => {
  return {
    id: item.id,
    tenDonVi: item.tenDonVi,
    email: item.email,
    dienThoai: item.dienThoai,
    parentId: item.parentId ?? 0,
    trangThai: item.trangThai,
    phanLoai:item.phanLoai
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
    trangThai: item.trangThai,
    phanLoai:item.phanLoai
  }
}

const baseJson = () => {
  return {
    id: null,
    tenDonVi: null,
    email: null,
    dienThoai: null,
    parentId: 0,
    trangThai: 1,
    phanLoai:null
  }
}

export const donViHanhChinhModel = {
  toJson,
  fromJson,
  baseJson
}
