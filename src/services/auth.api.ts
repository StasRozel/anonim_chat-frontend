import axios from "axios";
import { TelegramUser } from "../types/types";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class AuthAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  async login(user: TelegramUser): Promise<any> {
    try {
      console.log("login: ", user);
      const response = await this.api.post(
        "/auth/login",
        { user },
        {
          validateStatus: () => true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async register(user: TelegramUser): Promise<any> {
    try {
      const response = await this.api.post("/auth/register", { user });
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }
}

export const authAPI = new AuthAPI();
