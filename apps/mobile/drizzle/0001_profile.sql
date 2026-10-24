CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`birth_year` integer NOT NULL,
	`birth_month` integer NOT NULL,
	`grade` text NOT NULL,
	`field` text NOT NULL,
	`target_kind` text,
	`target_value` real,
	`exam_date` text NOT NULL,
	`weekday_minutes` text NOT NULL,
	`consent_status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
