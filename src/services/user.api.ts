import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class UserAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

  async getUsers(): Promise<any> {
    try {
      const response = await this.api.get("/user/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUser(id: number): Promise<any> {
    try {
      const response = await this.api.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

}


export const userAPI = new UserAPI();