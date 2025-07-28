export interface AccessRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  instagram: string
  approved: boolean
  createdAt: string
  approvedAt?: string
}

export interface QRToken {
  id: string
  token: string
  requestId: string
  used: boolean
  usedAt?: string
  createdAt: string
}

export interface AdminUser {
  username: string
  password: string
}
