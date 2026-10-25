CREATE TABLE `catalog_edition` (
	`id` text PRIMARY KEY NOT NULL,
	`isbn` text,
	`page_count` integer NOT NULL,
	`publisher` text NOT NULL,
	`series` text,
	`subject` text NOT NULL,
	`exam` text NOT NULL,
	`units` text NOT NULL,
	`fetched_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `library_item` (
	`id` text PRIMARY KEY NOT NULL,
	`source_kind` text NOT NULL,
	`edition_id` text,
	`custom_edition` text,
	`minutes_per_item` real,
	`sort_order` integer NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
