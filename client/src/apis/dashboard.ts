import ApiService from "@/utils/api";

/**
 * Dashboard statistics types
 */
export interface DashboardStats {
  peminjaman: PeminjamanStats;
  pembayaran: PembayaranStats;
  gedung: GedungStats;
}

export interface PeminjamanStats {
  total: number;
  diproses: number;
  disetujui: number;
  ditolak: number;
  selesai: number;
  byMonth: MonthlyStats[];
}

export interface PembayaranStats {
  total: number;
  paid: number;
  pending: number;
  canceled: number;
  refunded: number;
  totalAmount: number;
  byMonth: MonthlyAmountStats[];
  byQuarter: QuarterlyStats[];
}

export interface GedungStats {
  total: number;
  mostUsed: MostUsedGedung[];
  availableCount: number;
}

export interface MonthlyStats {
  month: string;
  count: number;
}

export interface MonthlyAmountStats {
  month: string;
  count: number;
  amount: number;
}

export interface QuarterlyStats {
  quarter: string;
  months: string[];
  data: MonthlyAmountStats[];
  total: number;
}

export interface MostUsedGedung {
  id: string;
  nama_gedung: string;
  count: number;
}

/**
 * Service for dashboard-related API operations
 */
export class DashboardService {
  private static baseUrl = "/api/v1/dashboard";

  /**
   * Get dashboard statistics
   */
  static async getStats(): Promise<DashboardStats> {
    try {
      const response = await ApiService.get<DashboardStats>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return fallback data if API fails
      return this.getFallbackStats();
    }
  }

  /**
   * Get room usage statistics
   */
  static async getRoomUsageStats(): Promise<PeminjamanStats> {
    try {
      const response = await ApiService.get<PeminjamanStats>(`${this.baseUrl}/room-usage`);
      return response.data;
    } catch (error) {
      console.error("Error fetching room usage stats:", error);
      // Return fallback data if API fails
      return this.getFallbackStats().peminjaman;
    }
  }

  /**
   * Get transaction statistics
   */
  static async getTransactionStats(): Promise<PembayaranStats> {
    try {
      const response = await ApiService.get<PembayaranStats>(`${this.baseUrl}/transactions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
      // Return fallback data if API fails
      return this.getFallbackStats().pembayaran;
    }
  }

  /**
   * Fallback data in case API fails
   */
  private static getFallbackStats(): DashboardStats {
    const currentYear = new Date().getFullYear();
    
    return {
      peminjaman: {
        total: 120,
        diproses: 15,
        disetujui: 85,
        ditolak: 10,
        selesai: 10,
        byMonth: [
          { month: 'Jan', count: 8 },
          { month: 'Feb', count: 12 },
          { month: 'Mar', count: 15 },
          { month: 'Apr', count: 10 },
          { month: 'May', count: 9 },
          { month: 'Jun', count: 14 },
          { month: 'Jul', count: 18 },
          { month: 'Aug', count: 21 },
          { month: 'Sep', count: 15 },
          { month: 'Oct', count: 10 },
          { month: 'Nov', count: 8 },
          { month: 'Dec', count: 7 }
        ]
      },
      pembayaran: {
        total: 95,
        paid: 85,
        pending: 10,
        canceled: 0,
        refunded: 0,
        totalAmount: 45750000,
        byMonth: [
          { month: 'Jan', count: 7, amount: 3500000 },
          { month: 'Feb', count: 10, amount: 5000000 },
          { month: 'Mar', count: 12, amount: 6000000 },
          { month: 'Apr', count: 8, amount: 4000000 },
          { month: 'May', count: 7, amount: 3500000 },
          { month: 'Jun', count: 12, amount: 6000000 },
          { month: 'Jul', count: 15, amount: 7500000 },
          { month: 'Aug', count: 18, amount: 9000000 },
          { month: 'Sep', count: 12, amount: 6000000 },
          { month: 'Oct', count: 8, amount: 4000000 },
          { month: 'Nov', count: 7, amount: 3500000 },
          { month: 'Dec', count: 5, amount: 2500000 }
        ],
        byQuarter: [
          {
            quarter: 'Q1',
            months: ['Jan', 'Feb', 'Mar'],
            data: [
              { month: 'Jan', count: 7, amount: 3500000 },
              { month: 'Feb', count: 10, amount: 5000000 },
              { month: 'Mar', count: 12, amount: 6000000 }
            ],
            total: 14500000
          },
          {
            quarter: 'Q2',
            months: ['Apr', 'May', 'Jun'],
            data: [
              { month: 'Apr', count: 8, amount: 4000000 },
              { month: 'May', count: 7, amount: 3500000 },
              { month: 'Jun', count: 12, amount: 6000000 }
            ],
            total: 13500000
          },
          {
            quarter: 'Q3',
            months: ['Jul', 'Aug', 'Sep'],
            data: [
              { month: 'Jul', count: 15, amount: 7500000 },
              { month: 'Aug', count: 18, amount: 9000000 },
              { month: 'Sep', count: 12, amount: 6000000 }
            ],
            total: 22500000
          },
          {
            quarter: 'Q4',
            months: ['Oct', 'Nov', 'Dec'],
            data: [
              { month: 'Oct', count: 8, amount: 4000000 },
              { month: 'Nov', count: 7, amount: 3500000 },
              { month: 'Dec', count: 5, amount: 2500000 }
            ],
            total: 10000000
          }
        ]
      },
      gedung: {
        total: 10,
        availableCount: 8,
        mostUsed: [
          { id: '1', nama_gedung: 'Aula Universitas', count: 24 },
          { id: '2', nama_gedung: 'Gedung Serba Guna', count: 18 },
          { id: '3', nama_gedung: 'Auditorium Utama', count: 15 },
          { id: '4', nama_gedung: 'Ruang Seminar Lt.3', count: 12 },
          { id: '5', nama_gedung: 'Aula Fakultas Teknik', count: 10 }
        ]
      }
    };
  }
}