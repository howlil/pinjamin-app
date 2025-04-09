// src/database/factories/Factory.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/id_ID';

export abstract class Factory<T> {
  protected prisma: PrismaClient;
  protected fakerInstance = faker;
  
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  abstract definition(): Partial<T>;
  

  async create(overrides: Partial<T> = {}): Promise<T> {
    const data = { ...this.definition(), ...overrides };
    return await this.store(data as T);
  }

  async createMany(count: number, overrides: Partial<T> = {}): Promise<T[]> {
    const items: T[] = [];
    for (let i = 0; i < count; i++) {
      const item = await this.create(overrides);
      items.push(item);
    }
    return items;
  }
  
 
  protected abstract store(data: T): Promise<T>;
}