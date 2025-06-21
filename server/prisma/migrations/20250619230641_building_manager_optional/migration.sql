-- DropForeignKey
ALTER TABLE `buildingmanager` DROP FOREIGN KEY `BuildingManager_buildingId_fkey`;

-- DropIndex
DROP INDEX `BuildingManager_buildingId_fkey` ON `buildingmanager`;

-- AlterTable
ALTER TABLE `building` MODIFY `buildingPhoto` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `buildingmanager` MODIFY `buildingId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `facility` MODIFY `iconUrl` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `BuildingManager` ADD CONSTRAINT `BuildingManager_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `Building`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
