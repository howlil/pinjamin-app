const { BuildingManagerFactory } = require('../factories');
const { prisma } = require('../../configs');
const { Logger } = require('../../utils');

class BuildingManagerSeeder {
    static async run() {
        Logger.info('Running Building Manager seeder...');

        try {
            // Get existing buildings for assignment
            const buildings = await prisma.building.findMany();

            if (buildings.length === 0) {
                Logger.warn('No buildings found, creating building managers without assignments');
            }

            // Create building managers data
            const managersData = [
                {
                    managerName: 'John Doe',
                    phoneNumber: '+6281234567890',
                    buildingId: buildings.length > 0 ? buildings[0].id : null
                },
                {
                    managerName: 'Jane Smith',
                    phoneNumber: '+6281234567891',
                    buildingId: buildings.length > 1 ? buildings[1].id : null
                },
                {
                    managerName: 'Michael Johnson',
                    phoneNumber: '+6281234567892',
                    buildingId: null // Unassigned manager
                },
                {
                    managerName: 'Sarah Wilson',
                    phoneNumber: '+6281234567893',
                    buildingId: null // Unassigned manager
                },
                {
                    managerName: 'David Brown',
                    phoneNumber: '+6281234567894',
                    buildingId: buildings.length > 2 ? buildings[2].id : null
                },
                {
                    managerName: 'Lisa Davis',
                    phoneNumber: '+6281234567895',
                    buildingId: null // Unassigned manager
                },
                {
                    managerName: 'Robert Taylor',
                    phoneNumber: '+6281234567896',
                    buildingId: null // Unassigned manager
                }
            ];

            // Create building managers
            for (const managerData of managersData) {
                await prisma.buildingManager.create({
                    data: managerData
                });
                Logger.info(`Created building manager: ${managerData.managerName}${managerData.buildingId ? ' (assigned)' : ' (unassigned)'}`);
            }

            Logger.info(`Building Manager seeder completed - created ${managersData.length} managers`);
            return true;
        } catch (error) {
            Logger.error('Error in Building Manager seeder:', error);
            throw error;
        }
    }
}

module.exports = BuildingManagerSeeder; 