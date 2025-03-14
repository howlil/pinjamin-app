import { prisma } from '../configs/db.config';
import { NotFoundError } from '../configs/error.config';
import { Notifikasi, NotifikasiCreate, NotifikasiUpdate } from '../types/notifikasi.types';
import { INotifikasiService } from '../interfaces/notifikasi.service.interface';
import { Notif } from '@prisma/client';
import { logger } from '../configs/logger.config';
import { pusher } from '../configs/pusher.config';
import { mapToNotifikasi, mapToNotifikasiArray } from '../mappers/notifikasi.mapper';

export class NotifikasiService implements INotifikasiService {
  async getAllNotifikasi(): Promise<Notifikasi[]> {
    const notifikasiList = await prisma.notifikasi.findMany({
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
    
    return mapToNotifikasiArray(notifikasiList);
  }

  async getNotifikasiById(id: string): Promise<Notifikasi> {
    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id },
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
    
    if (!notifikasi) {
      throw new NotFoundError('Notifikasi tidak ditemukan');
    }
    
    return mapToNotifikasi(notifikasi);
  }

  async getNotifikasiByUserId(userId: string): Promise<Notifikasi[]> {
    const notifikasiList = await prisma.notifikasi.findMany({
      where: { pengguna_id: userId },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return mapToNotifikasiArray(notifikasiList);
  }

  async getUnreadNotifikasiCount(userId: string): Promise<number> {
    const count = await prisma.notifikasi.count({
      where: {
        pengguna_id: userId,
        status_baca: 0
      }
    });
    
    return count;
  }

  async createNotifikasi(data: NotifikasiCreate): Promise<Notifikasi> {
    const notifikasi = await prisma.notifikasi.create({
      data
    });
    
    // If notification has a user, send push notification
    if (data.pengguna_id) {
      await this.sendPushNotification(
        data.pengguna_id,
        data.judul,
        data.pesan,
        data.jenis_notifikasi
      );
    }
    
    logger.info(`Notifikasi baru dibuat: ${notifikasi.id}`);
    
    return mapToNotifikasi(notifikasi);
  }

  async updateNotifikasi(id: string, data: NotifikasiUpdate): Promise<Notifikasi> {
    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id }
    });
    
    if (!notifikasi) {
      throw new NotFoundError('Notifikasi tidak ditemukan');
    }
    
    const updatedNotifikasi = await prisma.notifikasi.update({
      where: { id },
      data
    });
    
    logger.info(`Notifikasi ${id} telah diperbarui`);
    
    return mapToNotifikasi(updatedNotifikasi);
  }

  async deleteNotifikasi(id: string): Promise<boolean> {
    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id }
    });
    
    if (!notifikasi) {
      throw new NotFoundError('Notifikasi tidak ditemukan');
    }
    
    await prisma.notifikasi.delete({
      where: { id }
    });
    
    logger.info(`Notifikasi ${id} telah dihapus`);
    
    return true;
  }

  async markAsRead(id: string): Promise<Notifikasi> {
    const notifikasi = await prisma.notifikasi.findUnique({
      where: { id }
    });
    
    if (!notifikasi) {
      throw new NotFoundError('Notifikasi tidak ditemukan');
    }
    
    const updatedNotifikasi = await prisma.notifikasi.update({
      where: { id },
      data: {
        status_baca: 1
      }
    });
    
    logger.info(`Notifikasi ${id} telah dibaca`);
    
    return mapToNotifikasi(updatedNotifikasi);
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notifikasi.updateMany({
      where: {
        pengguna_id: userId,
        status_baca: 0
      },
      data: {
        status_baca: 1
      }
    });
    
    logger.info(`${result.count} notifikasi pengguna ${userId} telah dibaca`);
    
    return result.count;
  }

  async sendPushNotification(
    userId: string, 
    judul: string, 
    pesan: string, 
    jenisNotifikasi: Notif
  ): Promise<void> {
    try {
      // Send notification using Pusher
      await pusher.trigger(`user-${userId}`, 'notification', {
        judul,
        pesan,
        jenisNotifikasi,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`Push notification sent to user ${userId}`);
    } catch (error) {
      logger.error(`Failed to send push notification to user ${userId}`, { error });
    }
  }
}