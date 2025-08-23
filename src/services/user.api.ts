import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

class UserAPI {
  private api = axios.create({
    baseURL: API_BASE_URL,
  });

}
