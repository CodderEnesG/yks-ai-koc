CREATE TABLE `plan_task` (
	`id` text PRIMARY KEY NOT NULL,
	`library_item_id` text NOT NULL,
	`day` text NOT NULL,
	`kind` text NOT NULL,
	`unit_key` text NOT NULL,
	`range_first` integer NOT NULL,
	`range_last` integer NOT NULL,
	`est_seconds` integer NOT NULL,
	`status` text NOT NULL,
	`reason` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
