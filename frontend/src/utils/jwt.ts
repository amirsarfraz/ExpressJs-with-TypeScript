import { jwtDecode } from "jwt-decode";


export interface TokenPayload {
  id: number;
  email: string;
  role: string;
  username?: string;
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): TokenPayload => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    throw new Error("Invalid token");
  }
};

