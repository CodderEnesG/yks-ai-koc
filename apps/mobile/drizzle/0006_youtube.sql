CREATE TABLE `yt_playlist` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`channel_title` text NOT NULL,
	`videos` text NOT NULL,
	`fetched_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `library_item` ADD `yt_playlist_id` text;--> statement-breakpoint
ALTER TABLE `library_item` ADD `watch_speed` real;--> statement-breakpoint
ALTER TABLE `library_item` ADD `note_ratio` real;