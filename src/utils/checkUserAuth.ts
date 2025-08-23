import { authAPI } from "../services/auth.api"
import { TelegramUser } from "../types/types"

export const checkUserAuth = async (user: TelegramUser) => {
    const login = await authAPI.login(user);
    return {login, result: login?.error ? false : true};
}