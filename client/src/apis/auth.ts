import ApiService from "@/utils/api";
import { Login } from "@/interfaces/IAuth";

export class AuthService {
    private static baseUrl = "/api/v1";

    static async login (dataLogin:Login){
        const response = await ApiService.post<Login>(`${this.baseUrl}/login`,dataLogin)
        return response.data
    }

}