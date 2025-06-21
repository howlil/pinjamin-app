const { BuildingService } = require('../services');
const { Response } = require('../utils');

class BuildingController {
    static async create(req, res, next) {
        try {
            const buildingData = { ...req.body };

            if (req.body.facilities && typeof req.body.facilities === 'string') {
                buildingData.facilities = JSON.parse(req.body.facilities);
            }

            if (req.body.buildingManagers && typeof req.body.buildingManagers === 'string') {
                buildingData.buildingManagers = JSON.parse(req.body.buildingManagers);
            }

            const building = await BuildingService.create(buildingData, req.file);
            return Response.success(res, building, 'Building created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const result = await BuildingService.getAll(req.query);
            return Response.success(res, result.data, 'Buildings retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const building = await BuildingService.getById(id);
            return Response.success(res, building, 'Building retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            if (req.body.facilities && typeof req.body.facilities === 'string') {
                updateData.facilities = JSON.parse(req.body.facilities);
            }

            if (req.body.buildingManagers && typeof req.body.buildingManagers === 'string') {
                updateData.buildingManagers = JSON.parse(req.body.buildingManagers);
            }

            const building = await BuildingService.update(id, updateData, req.file);
            return Response.success(res, building, 'Building updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await BuildingService.delete(id);
            return Response.success(res, result, 'Building deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    static async checkAvailability(req, res, next) {
        try {
            const { date, time } = req.body;
            const result = await BuildingService.checkAvailability(date, time);
            return Response.success(res, result, 'Building availability checked successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getAllAdmin(req, res, next) {
        try {
            const result = await BuildingService.getAll(req.query);
            return Response.success(res, result.data, 'Buildings retrieved successfully', 200, result.pagination);
        } catch (error) {
            next(error);
        }
    }

    static async getAllBuildingsSchedule(req, res, next) {
        try {
            const { month, year } = req.query;
            const result = await BuildingService.getAllBuildingsSchedule(month, year);
            return Response.success(res, result, 'Buildings schedule retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = BuildingController; 