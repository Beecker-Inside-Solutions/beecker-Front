export interface IUser {
  email: string;
  password: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  userTypeId: number;
  [key: string]: any;
}
