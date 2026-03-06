export interface IComment {
  _id: string
  author: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface ICommentInput {
  author: string
  content: string
}

export interface ILoginInput {
  email: string
  password: string
}

export interface ILoginResponse {
  token: string
}

export interface IApiError {
  statusCode: number
  message: string
}

export interface IAuthPayload {
  email: string
  iat: number
  exp: number
}
