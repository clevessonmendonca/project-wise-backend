export interface CreateUserBody {
  email: string;
  name?: string;
  password: string;
}

export interface UpdateUserBody {
  email?: string;
  name?: string;
  password?: string;
}
