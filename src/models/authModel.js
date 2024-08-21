import { userModel } from '@/models/userModel'

const toJson = (item) => {
  return {
    userName: item.userName,
    password: item.password,
    remember: item.remember
  }
}

const fromJson = (item) => {
  return {
    token: item.accessToken,
    expired: item.expired,
    user: userModel.fromJson(item.user)
  }
}

const baseJson = () => {
  return {
    userName: null,
    password: null,
    remember: false
  }
}

export const authModel = {
  toJson, fromJson, baseJson
}
