// src/__tests__/services/notifikasi.service.test.ts
import { NotifikasiService } from '../../services/notifikasi.service';
import { prisma } from '../../configs/db.config';
import { pusher } from '../../configs/pusher.config';
import { NotFoundError } from '../../configs/error.config';
import { Notif } from '@prisma/client';
import { TestLogger } from '../../utils/test-logger.util';

jest.mock('../../configs/db.config');
jest.mock('../../configs/pusher.config');
jest.mock('../../configs/logger.config', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('NotifikasiService', () => {
  let notifikasiService: NotifikasiService;

  beforeEach(() => {
    jest.clearAllMocks();
    notifikasiService = new NotifikasiService();
  });

  describe('getAllNotifikasi', () => {
    it('should return all notifikasi', async () => {
      const mockNotifikasi = [
        {
          id: '1',
          pengguna_id: 'user-1',
          jenis_notifikasi: Notif.PEMINJAMAN,
          judul: 'Test Notifikasi',
          pesan: 'Pesan test',
          tanggal: '2023-01-01',
          status_baca: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          Pengguna: {
            id: 'user-1',
            nama_lengkap: 'User Test',
            email: 'user@test.com'
          }
        }
      ];

      (prisma.notifikasi.findMany as jest.Mock).mockResolvedValue(mockNotifikasi);

      const result = await notifikasiService.getAllNotifikasi();

      expect(prisma.notifikasi.findMany).toHaveBeenCalledWith({
        include: {
          Pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      expect(result).toEqual(mockNotifikasi);
    });
  });

  describe('getNotifikasiById', () => {
    it('should return notifikasi by id', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        jenis_notifikasi: Notif.PEMINJAMAN,
        judul: 'Test Notifikasi',
        pesan: 'Pesan test',
        tanggal: '2023-01-01',
        status_baca: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        Pengguna: {
          id: 'user-1',
          nama_lengkap: 'User Test',
          email: 'user@test.com'
        }
      };

      (prisma.notifikasi.findUnique as jest.Mock).mockResolvedValue(mockNotifikasi);

      const result = await notifikasiService.getNotifikasiById('1');

      expect(prisma.notifikasi.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          Pengguna: {
            select: {
              id: true,
              nama_lengkap: true,
              email: true
            }
          }
        }
      });
      expect(result).toEqual(mockNotifikasi);
    });

    it('should throw NotFoundError when notifikasi not found', async () => {
      (prisma.notifikasi.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(notifikasiService.getNotifikasiById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getNotifikasiByUserId', () => {
    it('should return notifikasi by user id', async () => {
      const mockNotifikasi = [
        {
          id: '1',
          pengguna_id: 'user-1',
          jenis_notifikasi: Notif.PEMINJAMAN,
          judul: 'Test Notifikasi',
          pesan: 'Pesan test',
          tanggal: '2023-01-01',
          status_baca: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (prisma.notifikasi.findMany as jest.Mock).mockResolvedValue(mockNotifikasi);

      const result = await notifikasiService.getNotifikasiByUserId('user-1');

      expect(prisma.notifikasi.findMany).toHaveBeenCalledWith({
        where: { pengguna_id: 'user-1' },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(mockNotifikasi);
    });
  });

  describe('createNotifikasi', () => {
    it('should create a new notifikasi', async () => {
      const notifikasiData = {
        pengguna_id: 'user-1',
        jenis_notifikasi: Notif.PEMINJAMAN,
        judul: 'New Notifikasi',
        pesan: 'Pesan baru',
        tanggal: '2023-02-01',
        status_baca: 0
      };

      const mockCreatedNotifikasi = {
        ...notifikasiData,
        id: 'notifikasi-new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.notifikasi.create as jest.Mock).mockResolvedValue(mockCreatedNotifikasi);
      (pusher.trigger as jest.Mock).mockResolvedValue({});

      const result = await notifikasiService.createNotifikasi(notifikasiData);

      expect(prisma.notifikasi.create).toHaveBeenCalledWith({
        data: notifikasiData
      });
      expect(pusher.trigger).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedNotifikasi);
    });

    it('should create notifikasi without sending push notification if no pengguna_id', async () => {
      const notifikasiData = {
        jenis_notifikasi: Notif.PEMINJAMAN,
        judul: 'System Notifikasi',
        pesan: 'Pesan sistem',
        tanggal: '2023-02-01',
        status_baca: 0
      };

      const mockCreatedNotifikasi = {
        ...notifikasiData,
        id: 'notifikasi-new',
        pengguna_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (prisma.notifikasi.create as jest.Mock).mockResolvedValue(mockCreatedNotifikasi);

      const result = await notifikasiService.createNotifikasi(notifikasiData);

      expect(prisma.notifikasi.create).toHaveBeenCalledWith({
        data: notifikasiData
      });
      expect(pusher.trigger).not.toHaveBeenCalled();
      expect(result).toEqual(mockCreatedNotifikasi);
    });
  });

  describe('markAsRead', () => {
    it('should mark notifikasi as read', async () => {
      const mockNotifikasi = {
        id: '1',
        pengguna_id: 'user-1',
        jenis_notifikasi: Notif.PEMINJAMAN,
        judul: 'Test Notifikasi',
        pesan: 'Pesan test',
        tanggal: '2023-01-01',
        status_baca: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockUpdatedNotifikasi = {
        ...mockNotifikasi,
        status_baca: 1
      };

      (prisma.notifikasi.findUnique as jest.Mock).mockResolvedValue(mockNotifikasi);
      (prisma.notifikasi.update as jest.Mock).mockResolvedValue(mockUpdatedNotifikasi);

      const result = await notifikasiService.markAsRead('1');

      expect(prisma.notifikasi.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(prisma.notifikasi.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status_baca: 1 }
      });
      expect(result).toEqual(mockUpdatedNotifikasi);
    });

    it('should throw NotFoundError when notifikasi not found', async () => {
      (prisma.notifikasi.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(notifikasiService.markAsRead('999')).rejects.toThrow(NotFoundError);
      expect(prisma.notifikasi.update).not.toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all user notifikasi as read', async () => {
      (prisma.notifikasi.updateMany as jest.Mock).mockResolvedValue({ count: 5 });

      const result = await notifikasiService.markAllAsRead('user-1');

      expect(prisma.notifikasi.updateMany).toHaveBeenCalledWith({
        where: {
          pengguna_id: 'user-1',
          status_baca: 0
        },
        data: {
          status_baca: 1
        }
      });
      expect(result).toBe(5);
    });
  });

  describe('getUnreadNotifikasiCount', () => {
    it('should return unread notification count', async () => {
      (prisma.notifikasi.count as jest.Mock).mockResolvedValue(3);

      const result = await notifikasiService.getUnreadNotifikasiCount('user-1');

      expect(prisma.notifikasi.count).toHaveBeenCalledWith({
        where: {
          pengguna_id: 'user-1',
          status_baca: 0
        }
      });
      expect(result).toBe(3);
    });
  });

  describe('sendPushNotification', () => {
    it('should send push notification via Pusher', async () => {
      (pusher.trigger as jest.Mock).mockResolvedValue({});

      await notifikasiService.sendPushNotification(
        'user-1',
        'Test Notification',
        'This is a test',
        Notif.PEMINJAMAN
      );

      expect(pusher.trigger).toHaveBeenCalledWith(
        'user-user-1',
        'notification',
        expect.objectContaining({
          judul: 'Test Notification',
          pesan: 'This is a test',
          jenisNotifikasi: Notif.PEMINJAMAN,
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle errors when sending push notification', async () => {
      const error = new Error('Pusher error');
      (pusher.trigger as jest.Mock).mockRejectedValue(error);

      // Should not throw error
      await notifikasiService.sendPushNotification(
        'user-1',
        'Test Notification',
        'This is a test',
        Notif.PEMINJAMAN
      );

      expect(pusher.trigger).toHaveBeenCalled();
    });
  });
});