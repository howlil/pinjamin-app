import ApiService from "@/utils/api";
import { Login,LoginResponse, Register,Pengguna} from "@/interfaces/IAuth";

export class AuthService {
    private static baseUrl = "/api/v1";

    static async login (dataLogin:Login):Promise<LoginResponse>{
        const response = await ApiService.post<LoginResponse>(`${this.baseUrl}/login`,dataLogin)
        return response.data
    }

    static async register (dataRegis :Register ):Promise<Pengguna>{
        const res = await ApiService.post<Pengguna>(`${this.baseUrl}/register`,dataRegis)
        return res.data
    }


}