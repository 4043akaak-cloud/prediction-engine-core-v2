ALTER TABLE `recipes` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `category` enum('FINANCE','SPORTS','WEATHER','HEALTH','TECHNOLOGY','POLITICS','OTHER') NOT NULL DEFAULT 'OTHER';--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `version` int NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `status` enum('ACTIVE','DRAFT','ARCHIVED') NOT NULL DEFAULT 'DRAFT';--> statement-breakpoint
ALTER TABLE `recipes` MODIFY COLUMN `isPublic` tinyint NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `recipes` ADD `type` enum('SYSTEM','USER','COMMUNITY','FEATURED') DEFAULT 'USER' NOT NULL;--> statement-breakpoint
ALTER TABLE `recipes` ADD `displayOrder` int;--> statement-breakpoint
ALTER TABLE `recipes` ADD `createdFromRecipeId` varchar(36);--> statement-breakpoint
CREATE INDEX `idx_recipes_type` ON `recipes` (`type`);--> statement-breakpoint
CREATE INDEX `idx_recipes_user_id` ON `recipes` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_recipes_created_from` ON `recipes` (`createdFromRecipeId`);--> statement-breakpoint
CREATE INDEX `idx_recipes_type_display_order` ON `recipes` (`type`,`displayOrder`);--> statement-breakpoint
CREATE INDEX `idx_recipes_status` ON `recipes` (`status`);--> statement-breakpoint
CREATE INDEX `idx_recipes_category` ON `recipes` (`category`);