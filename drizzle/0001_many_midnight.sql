CREATE TABLE `recipe_engines` (
	`id` varchar(36) NOT NULL,
	`recipeId` varchar(36) NOT NULL,
	`engineId` varchar(100) NOT NULL,
	`weight` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `recipe_engines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`version` varchar(20) NOT NULL DEFAULT '1.0.0',
	`status` enum('draft','ready','archived') NOT NULL DEFAULT 'draft',
	`isPublic` tinyint NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
