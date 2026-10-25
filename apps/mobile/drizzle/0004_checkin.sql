CREATE TABLE `checkin` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`correct_count` integer,
	`wrong_count` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `checkin_day_unique` ON `checkin` (`day`);