import { AppError } from '../configs/error';

export abstract class BaseRepository<T, CreateDto, UpdateDto = Partial<CreateDto>> {
  protected model: any;

  constructor(modelName: any) {
    this.model = modelName;
  }

  async findAll(filter: object = {}): Promise<T[]> {
    try {
      return await this.model.findMany({
        where: filter,
      });
    } catch (error) {
      throw new AppError(`Gagal mendapatkan data: ${error}`, 500);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new AppError(`Gagal mendapatkan data berdasarkan ID: ${error}`, 500);
    }
  }

  async create(data: CreateDto): Promise<T> {
    try {
      return await this.model.create({
        data,
      });
    } catch (error) {
      throw new AppError(`Gagal membuat data: ${error}`, 500);
    }
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new AppError(`Gagal update data: ${error}`, 500);
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError(`Gagal menghapus data: ${error}`, 500);
    }
  }
}