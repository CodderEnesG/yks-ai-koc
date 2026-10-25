-- MEB OGM katalog tohumu (T12, ilk parça). tools/toc-eval/catalog-seed.ts ile üretildi; elle düzenlenmez.
-- Yalnız olgular: ISBN, sayfa sayısı, birim sayfa aralıkları. Ham başlık yok (değişmez kural).
-- Baskılar "draft": otomatik çıkarıldı, editör doğrulaması bekliyor.

-- 3adim-tyt-biyoloji
insert into public.work (id, publisher, series, subject, exam, kind) values ('88cd78b2-f5e8-4c03-8b89-b93d4ce7c76c', 'MEB OGM', '3 Adım Soru Bankası', 'Biyoloji', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('27eb104d-c646-44e2-8f8e-c335234aa8e7', '88cd78b2-f5e8-4c03-8b89-b93d4ce7c76c', '9789751159991', null, 138, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('e60ce35a-924e-41f5-8245-910b4ef49ddd', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 1, 11, 18),
  ('7a33ca3b-b485-4c48-8971-5f3cd0116c6f', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 2, 19, 26),
  ('18843497-429d-407b-857e-7927e7ef9474', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 3, 27, 34),
  ('11df6957-6431-4668-86e0-80e689d61df6', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 4, 35, 40),
  ('4df83879-b4c8-4017-8e4a-55a93b67338e', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 5, 41, 48),
  ('24dd66e6-b462-4c40-8abb-c68d84425ef3', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 6, 49, 58),
  ('e7a8cb63-dcee-4df4-82f7-2865d32bf4a7', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 7, 59, 68),
  ('e12d9da9-c6e4-4e2b-8058-f8bdecfe8a5d', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 8, 69, 78),
  ('c599fe4c-3c70-4c2e-8847-dbfa4e011030', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 9, 79, 86),
  ('33a31bfa-6363-4f07-8e6c-c9a0cf405902', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 10, 87, 94),
  ('7f10eac6-e15d-4941-886e-f6f24942d8ec', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 11, 95, 102),
  ('911a39a8-a8d2-4dfa-892b-da155d31cf46', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 12, 103, 112),
  ('e3361900-9dbb-44ae-8da9-58068e3985ea', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 13, 113, 118),
  ('cf23d04a-d3c1-41ff-8b0a-ddc2394893f8', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 14, 119, 126),
  ('85e35d00-6e6a-4d04-87f8-611f3b925364', '27eb104d-c646-44e2-8f8e-c335234aa8e7', 15, 127, 134);

-- 3adim-tyt-cografya
insert into public.work (id, publisher, series, subject, exam, kind) values ('6555ce32-5bdf-41bd-8f4c-cea3d2451652', 'MEB OGM', '3 Adım Soru Bankası', 'Coğrafya', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('96211947-251d-4e1b-8f23-b99ad1aa1410', '6555ce32-5bdf-41bd-8f4c-cea3d2451652', '9789751159984', null, 152, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('c31d7d28-93ca-4916-8bd4-440bbea3d223', '96211947-251d-4e1b-8f23-b99ad1aa1410', 1, 11, 16),
  ('94ec8db5-5600-4cf2-8009-dcc226bb5985', '96211947-251d-4e1b-8f23-b99ad1aa1410', 2, 17, 22),
  ('27e4d9c4-c52f-4f86-8edc-52bb16199064', '96211947-251d-4e1b-8f23-b99ad1aa1410', 3, 23, 28),
  ('8188519f-6bd2-494f-8a49-d9e94cccf1ee', '96211947-251d-4e1b-8f23-b99ad1aa1410', 4, 29, 34),
  ('105274b0-e296-4896-8d92-350eabc13cd8', '96211947-251d-4e1b-8f23-b99ad1aa1410', 5, 35, 40),
  ('5219e08c-99f0-444e-8c91-b1b8ca944122', '96211947-251d-4e1b-8f23-b99ad1aa1410', 6, 41, 46),
  ('f78af4f2-28c3-4670-8ebb-f077908255af', '96211947-251d-4e1b-8f23-b99ad1aa1410', 7, 47, 52),
  ('11a02c8b-179a-41a3-8467-1b4cda8c975e', '96211947-251d-4e1b-8f23-b99ad1aa1410', 8, 53, 58),
  ('d41f32dc-a3d6-44a6-8dac-30281656b1e0', '96211947-251d-4e1b-8f23-b99ad1aa1410', 9, 59, 64),
  ('c4ec98ba-48fc-43f4-81c9-eccbe414ce20', '96211947-251d-4e1b-8f23-b99ad1aa1410', 10, 65, 70),
  ('000006ec-eb30-48d6-8838-88779deb50e2', '96211947-251d-4e1b-8f23-b99ad1aa1410', 11, 71, 76),
  ('1de33d93-5c61-4296-8611-29de5caec130', '96211947-251d-4e1b-8f23-b99ad1aa1410', 12, 77, 82),
  ('bcebfe0c-b51c-425a-895b-587b5988b85c', '96211947-251d-4e1b-8f23-b99ad1aa1410', 13, 83, 88),
  ('fd604fd4-85eb-4c6e-8b8b-5cf92ab31404', '96211947-251d-4e1b-8f23-b99ad1aa1410', 14, 89, 94),
  ('362a51f4-e7bc-40d1-86cd-2c6b03c7e1ad', '96211947-251d-4e1b-8f23-b99ad1aa1410', 15, 95, 100),
  ('48ee5339-ff34-4af3-8cfb-3c7425544e30', '96211947-251d-4e1b-8f23-b99ad1aa1410', 16, 101, 106),
  ('9eba0788-143c-4195-82e0-4eb332ef5db5', '96211947-251d-4e1b-8f23-b99ad1aa1410', 17, 107, 112),
  ('45fc0c39-895d-42d6-8a1b-e32755b3f8ed', '96211947-251d-4e1b-8f23-b99ad1aa1410', 18, 113, 118),
  ('33f5adb0-4743-40c6-8fde-cd2409160816', '96211947-251d-4e1b-8f23-b99ad1aa1410', 19, 119, 124),
  ('5c8c5533-a6dc-4b47-81a7-61bf63b4b994', '96211947-251d-4e1b-8f23-b99ad1aa1410', 20, 125, 130),
  ('06acd9b3-628e-49ac-87c5-ea97ccd7efed', '96211947-251d-4e1b-8f23-b99ad1aa1410', 21, 131, 136),
  ('3f6e6f88-6521-4cfd-88db-f2c358c19dc9', '96211947-251d-4e1b-8f23-b99ad1aa1410', 22, 137, 142),
  ('0e0ccc66-22f6-4b50-8118-1d53b7a8c63c', '96211947-251d-4e1b-8f23-b99ad1aa1410', 23, 143, 148);

-- 3adim-tyt-felsefe
insert into public.work (id, publisher, series, subject, exam, kind) values ('a8a40d56-9cde-4fdd-8bcc-ddd76c1afe37', 'MEB OGM', '3 Adım Soru Bankası', 'Felsefe', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('aad31372-e0c6-4454-818e-1df59583faa8', 'a8a40d56-9cde-4fdd-8bcc-ddd76c1afe37', '9789751159984', null, 172, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('2b0c4be9-1d23-42dd-8328-5e2c8472e1bf', 'aad31372-e0c6-4454-818e-1df59583faa8', 1, 11, 16),
  ('5bd33d4f-b00b-4815-8a56-76011f447a80', 'aad31372-e0c6-4454-818e-1df59583faa8', 2, 17, 22),
  ('c7ff5c16-e8d5-4c00-83b2-42627884419d', 'aad31372-e0c6-4454-818e-1df59583faa8', 3, 23, 28),
  ('0094525a-7c88-4333-8553-435a10d1d810', 'aad31372-e0c6-4454-818e-1df59583faa8', 4, 29, 34),
  ('c6f56367-60c1-42d7-8417-327e894425bf', 'aad31372-e0c6-4454-818e-1df59583faa8', 5, 35, 40),
  ('2bc0b6c0-03d9-47fe-86e9-5b92dc424b3e', 'aad31372-e0c6-4454-818e-1df59583faa8', 6, 41, 46),
  ('90337ccd-44ca-4b08-8518-d6747ad4b727', 'aad31372-e0c6-4454-818e-1df59583faa8', 7, 47, 52),
  ('463a8df9-4336-4574-86f8-f1a84db700ba', 'aad31372-e0c6-4454-818e-1df59583faa8', 8, 53, 58),
  ('b2cbb945-ded1-4300-8a2d-670240166348', 'aad31372-e0c6-4454-818e-1df59583faa8', 9, 59, 64),
  ('181d5afc-18ac-43f4-88b0-f787022594ee', 'aad31372-e0c6-4454-818e-1df59583faa8', 10, 65, 70),
  ('b8454721-7d95-455a-81de-9d40303a5f62', 'aad31372-e0c6-4454-818e-1df59583faa8', 11, 71, 76),
  ('79faea84-8412-492b-8738-5b8dc575d3b7', 'aad31372-e0c6-4454-818e-1df59583faa8', 12, 77, 82),
  ('9fdc8d45-5bc0-438f-897d-2c8f14397fe2', 'aad31372-e0c6-4454-818e-1df59583faa8', 13, 83, 88),
  ('f0196782-3219-4b50-87c1-d03c720bc2ae', 'aad31372-e0c6-4454-818e-1df59583faa8', 14, 89, 94),
  ('c31428e2-b94e-4488-8a81-1a7feab35ae9', 'aad31372-e0c6-4454-818e-1df59583faa8', 15, 95, 100),
  ('d1ccc8f6-61e0-46d2-826a-f94cf7d04bd2', 'aad31372-e0c6-4454-818e-1df59583faa8', 16, 101, 106),
  ('f737e30d-8ac8-4cdd-8f88-bcf4bd4e1c21', 'aad31372-e0c6-4454-818e-1df59583faa8', 17, 107, 112),
  ('1fff5fa9-179e-458d-87f3-28958605988f', 'aad31372-e0c6-4454-818e-1df59583faa8', 18, 113, 118),
  ('8eeb8779-9aec-46ca-823a-7eb2bfdd556b', 'aad31372-e0c6-4454-818e-1df59583faa8', 19, 119, 124),
  ('dd7cae60-0b1a-4f84-8f78-16b6177b1a61', 'aad31372-e0c6-4454-818e-1df59583faa8', 20, 125, 130),
  ('5ed18127-b45f-4ec2-8e5d-5bd6e9201f52', 'aad31372-e0c6-4454-818e-1df59583faa8', 21, 131, 136),
  ('e0beb9c3-a6b7-4d4c-8982-15b1873fa76f', 'aad31372-e0c6-4454-818e-1df59583faa8', 22, 137, 142),
  ('49a26842-7ad9-4412-87da-88fee1e288d3', 'aad31372-e0c6-4454-818e-1df59583faa8', 23, 143, 148),
  ('06384d68-3a67-4ad9-8208-a948be9022a2', 'aad31372-e0c6-4454-818e-1df59583faa8', 24, 149, 154),
  ('5e359625-9637-467b-8bea-64d897b97ed2', 'aad31372-e0c6-4454-818e-1df59583faa8', 25, 155, 160),
  ('23a1ad5b-d49e-447c-8c46-bbe486bd18d6', 'aad31372-e0c6-4454-818e-1df59583faa8', 26, 161, 166);

-- 3adim-tyt-fizik
insert into public.work (id, publisher, series, subject, exam, kind) values ('845fee3e-da9d-4d28-827f-32297052955b', 'MEB OGM', '3 Adım Soru Bankası', 'Fizik', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('854ed8a7-f2b1-49e8-86ed-2870da2fe210', '845fee3e-da9d-4d28-827f-32297052955b', '9789751159991', null, 152, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('7a208c83-bf8c-4e79-89b6-8652606ebec5', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 1, 11, 18),
  ('d0d7271e-a5ae-4f65-8df5-8044ab9a52d7', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 2, 19, 26),
  ('98c501f9-8bb3-4f4e-814b-0d54e09e0606', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 3, 27, 34),
  ('fc8febb5-c833-44d5-8088-6709e52b0bbd', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 4, 35, 42),
  ('5aaa0164-7696-467e-876f-89744a227ddb', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 5, 43, 50),
  ('e87711b1-7cb9-42cf-8cbe-97766f4bc73f', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 6, 51, 58),
  ('3ec97476-f477-427a-8945-1b7581153c8c', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 7, 59, 66),
  ('bfda10b0-6a65-4da3-8cb1-367d11549613', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 8, 67, 72),
  ('76902fa1-6034-4a0c-8e37-63f1d492e9ef', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 9, 73, 84),
  ('0164d373-7adf-4243-81d8-efe25aecc864', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 10, 85, 90),
  ('1df228ba-e73d-4b21-8ba6-b49200012cb1', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 11, 91, 98),
  ('892ca5e9-c61e-4cc9-8ffb-ad5f320cb807', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 12, 99, 106),
  ('c2eee859-2917-470c-80f5-d9b12e677181', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 13, 107, 112),
  ('83af5819-3a18-4cb0-8b4e-0a5f3243bf34', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 14, 113, 118),
  ('e97b6eaf-364a-4a6e-87f9-7d4e4176f966', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 15, 119, 124),
  ('9f326127-5dca-4c36-8446-eb372f4a95fc', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 16, 125, 130),
  ('4488ca08-301e-42ba-83b4-10e5088f48c6', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 17, 131, 136),
  ('3927310f-5a49-48e9-8219-cb11a3c560b2', '854ed8a7-f2b1-49e8-86ed-2870da2fe210', 18, 137, 148);

-- 3adim-tyt-kimya
insert into public.work (id, publisher, series, subject, exam, kind) values ('3d35dad4-6839-45ae-856d-3310297af061', 'MEB OGM', '3 Adım Soru Bankası', 'Kimya', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('c24619d2-7bdf-4379-8cad-ce207d0402ea', '3d35dad4-6839-45ae-856d-3310297af061', '9789751159991', null, 150, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('0f9dee46-3ea0-43b1-8f88-1c6430fce673', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 1, 11, 20),
  ('32299674-7d0c-4b9b-8447-87f333ef43a6', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 2, 21, 32),
  ('abe9ea35-d022-4c4a-8a31-fcf66fd79e48', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 3, 33, 44),
  ('d4989cac-833a-42cf-8e0d-73de858814d4', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 4, 45, 56),
  ('9e3bbc33-dc78-4cf2-8034-cea54ce84572', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 5, 57, 68),
  ('8132fbba-c49f-473a-8ae3-29ae41ef5173', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 6, 69, 80),
  ('67d53525-86c1-4cea-82c5-0e361e77c3ad', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 7, 81, 88),
  ('d22e0441-4834-41e2-8bcc-e3c755a2502a', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 8, 89, 100),
  ('ffbc71ee-3c4d-4772-8b4a-51a18d8d8b99', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 9, 101, 112),
  ('3ed8b52a-975a-44db-80dd-b914ca80ab9e', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 10, 113, 124),
  ('bdf9faad-ab78-4509-8aeb-3bbefce1df3f', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 11, 125, 136),
  ('84df97e1-e573-4dcf-8cb4-eca0e8738b5f', 'c24619d2-7bdf-4379-8cad-ce207d0402ea', 12, 137, 146);

-- 3adim-tyt-matematik
insert into public.work (id, publisher, series, subject, exam, kind) values ('eb1df44a-2aee-4b4f-8ee5-7c58fc6e4e27', 'MEB OGM', '3 Adım Soru Bankası', 'Matematik', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('82233536-d33d-4992-8b4e-2e1941248ce4', 'eb1df44a-2aee-4b4f-8ee5-7c58fc6e4e27', '9789751159991', null, 220, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('73cc5aca-ff0d-4470-8f7a-3dcf51286ca9', '82233536-d33d-4992-8b4e-2e1941248ce4', 1, 11, 16),
  ('83df69a8-7a08-4a6f-805a-25f9dda6258e', '82233536-d33d-4992-8b4e-2e1941248ce4', 2, 17, 22),
  ('08f711e3-aad9-4922-8f81-93ac02257f81', '82233536-d33d-4992-8b4e-2e1941248ce4', 3, 23, 28),
  ('a4f78d88-416c-4d65-8a7c-1947fb217b68', '82233536-d33d-4992-8b4e-2e1941248ce4', 4, 29, 34),
  ('86077097-e156-4638-8d6c-7cb84e95bdfa', '82233536-d33d-4992-8b4e-2e1941248ce4', 5, 35, 40),
  ('a2e00c68-c593-47ed-8e63-7abdc980f049', '82233536-d33d-4992-8b4e-2e1941248ce4', 6, 41, 46),
  ('7f839723-7298-4ce1-828a-584c51921b39', '82233536-d33d-4992-8b4e-2e1941248ce4', 7, 47, 52),
  ('8fe088f6-44d7-46ac-80c1-32240079302d', '82233536-d33d-4992-8b4e-2e1941248ce4', 8, 53, 58),
  ('b34e3ba7-ce43-4e7f-8021-9573ed4b66c6', '82233536-d33d-4992-8b4e-2e1941248ce4', 9, 59, 64),
  ('7dc4ee85-86e8-4910-84ca-0b4bed12c1d5', '82233536-d33d-4992-8b4e-2e1941248ce4', 10, 65, 70),
  ('362747db-a7cf-43fc-8224-3cb2c18d1d27', '82233536-d33d-4992-8b4e-2e1941248ce4', 11, 71, 76),
  ('db9ecbeb-737b-4d00-88f2-6d23b629ac2a', '82233536-d33d-4992-8b4e-2e1941248ce4', 12, 77, 82),
  ('5968d87c-f726-4c66-8e25-d2c58952a7f7', '82233536-d33d-4992-8b4e-2e1941248ce4', 13, 83, 88),
  ('4b8075ac-db9c-475c-8a79-6f550d1eb35b', '82233536-d33d-4992-8b4e-2e1941248ce4', 14, 89, 94),
  ('77d781a4-289f-4b70-8f54-69841b12b79a', '82233536-d33d-4992-8b4e-2e1941248ce4', 15, 95, 100),
  ('3eaf2776-2ab7-41c4-89c0-66d8374c4366', '82233536-d33d-4992-8b4e-2e1941248ce4', 16, 101, 106),
  ('6be327de-ebd1-4c6b-8630-a95b767431b5', '82233536-d33d-4992-8b4e-2e1941248ce4', 17, 107, 112),
  ('fe9b6fbd-a575-498d-8cfe-1efa8b58cea9', '82233536-d33d-4992-8b4e-2e1941248ce4', 18, 113, 118),
  ('c66e5d3d-aca4-4154-8d16-be5a2d1f70d4', '82233536-d33d-4992-8b4e-2e1941248ce4', 19, 119, 124),
  ('63544e54-2c6e-49ea-8643-ff60a3bae466', '82233536-d33d-4992-8b4e-2e1941248ce4', 20, 125, 130),
  ('7a1cb3e1-5678-48b3-8bfe-2f81cf7782ae', '82233536-d33d-4992-8b4e-2e1941248ce4', 21, 131, 136),
  ('dd346222-294e-4498-8b9e-554967c999c8', '82233536-d33d-4992-8b4e-2e1941248ce4', 22, 137, 142),
  ('04f7775e-8856-477b-8110-551d3a2ca6ce', '82233536-d33d-4992-8b4e-2e1941248ce4', 23, 143, 148),
  ('cf72c8c2-5ce7-4eb8-8f47-9485b6eb335c', '82233536-d33d-4992-8b4e-2e1941248ce4', 24, 149, 154),
  ('45ab34f5-96ca-4b33-84cb-e24687c2d18a', '82233536-d33d-4992-8b4e-2e1941248ce4', 25, 155, 160),
  ('6b8f6624-46ce-473e-8910-2e3d94a4fffe', '82233536-d33d-4992-8b4e-2e1941248ce4', 26, 161, 166),
  ('ba9afbd2-38f3-4012-80a7-59cd8328defd', '82233536-d33d-4992-8b4e-2e1941248ce4', 27, 167, 172),
  ('2fba9b05-4690-418b-8a89-b0266f539827', '82233536-d33d-4992-8b4e-2e1941248ce4', 28, 173, 178),
  ('b5a3cbe1-8246-486e-84fc-228c2387132e', '82233536-d33d-4992-8b4e-2e1941248ce4', 29, 179, 184),
  ('124360c0-d871-4ce0-8a50-9789d9d17eee', '82233536-d33d-4992-8b4e-2e1941248ce4', 30, 185, 190),
  ('e621302d-3cf4-4764-8c4e-24c68d8adeff', '82233536-d33d-4992-8b4e-2e1941248ce4', 31, 191, 196),
  ('1e3f1802-c951-4d1e-8d96-1cb909d029e7', '82233536-d33d-4992-8b4e-2e1941248ce4', 32, 197, 202),
  ('fca1b9e2-8d2a-49e6-86a1-a7aeb3a95ea6', '82233536-d33d-4992-8b4e-2e1941248ce4', 33, 203, 208),
  ('7ec50746-7a4e-4611-8440-9083e6cf9cb9', '82233536-d33d-4992-8b4e-2e1941248ce4', 34, 209, 214);

-- 3adim-tyt-tarih
insert into public.work (id, publisher, series, subject, exam, kind) values ('a125ec36-3a70-460b-8439-5cd71e52f0a2', 'MEB OGM', '3 Adım Soru Bankası', 'Tarih', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 'a125ec36-3a70-460b-8439-5cd71e52f0a2', '9789751159984', null, 130, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('8b11a9d7-d897-41c9-8b1a-0616a307ca09', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 1, 11, 16),
  ('4cd6b35c-9a87-4902-8ab5-1e38b03461aa', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 2, 17, 22),
  ('9f12751e-a8b0-4e31-8033-2f0bb897c8cf', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 3, 23, 28),
  ('130877c7-8cb9-4e3d-87fb-93e745d8c81d', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 4, 29, 34),
  ('c24adc5f-736c-4fae-8979-8a3c2092aa96', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 5, 35, 40),
  ('e13e6b13-4428-4d42-8f5c-17f331170b03', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 6, 41, 46),
  ('50dc2966-7475-4705-842b-854d1e161644', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 7, 47, 52),
  ('1db08060-b928-4b9c-8e48-9d76ae764379', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 8, 53, 58),
  ('1f41c60f-edb5-47bb-8136-a59dbe423e2f', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 9, 59, 64),
  ('ddd56314-b3d0-49b3-8451-f5f021ab17dc', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 10, 65, 70),
  ('332f7614-9e9d-425d-872b-367e979e3e6d', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 11, 71, 76),
  ('5533c63a-a648-44c4-82e9-52dda774d132', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 12, 77, 82),
  ('93195a36-2f67-436d-8d50-fed8ca8f7fa8', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 13, 83, 88),
  ('73686013-c453-4874-808b-8235282dda7a', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 14, 89, 94),
  ('a276e5b3-751f-4234-8dec-ef7061634035', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 15, 95, 100),
  ('28bc5a21-f12b-4c13-85b8-cca2553d736c', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 16, 101, 106),
  ('f389bab0-1f1e-47a2-8070-2ef67443896c', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 17, 107, 112),
  ('29084964-3b39-431b-8f79-42f7bffaf2b1', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 18, 113, 118),
  ('6273c3d2-2e72-4875-8663-b20a06f42570', 'e241de02-5fb5-43e7-8cb0-3fa50cb52c51', 19, 119, 125);

-- 3adim-tyt-turkce
insert into public.work (id, publisher, series, subject, exam, kind) values ('62f1c683-d00e-4b83-81d5-0bd2460e782a', 'MEB OGM', '3 Adım Soru Bankası', 'Türkçe', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('a33845db-e9b9-467f-809d-878d9ec22454', '62f1c683-d00e-4b83-81d5-0bd2460e782a', '9789751159984', null, 281, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('148eea2a-31ab-4251-873b-98a81008fe09', 'a33845db-e9b9-467f-809d-878d9ec22454', 1, 11, 16),
  ('87061b4a-a582-4d0d-8bfe-3f22b999b1e2', 'a33845db-e9b9-467f-809d-878d9ec22454', 2, 17, 22),
  ('edfa9043-ad11-4742-8965-a34a106dd4b0', 'a33845db-e9b9-467f-809d-878d9ec22454', 3, 23, 28),
  ('00032136-caad-4723-887c-acffd14b8af6', 'a33845db-e9b9-467f-809d-878d9ec22454', 4, 29, 34),
  ('92bffb97-890e-4b00-84c5-be80c68c5219', 'a33845db-e9b9-467f-809d-878d9ec22454', 5, 35, 40),
  ('4df9304f-d52d-4639-837e-04da9f75b75d', 'a33845db-e9b9-467f-809d-878d9ec22454', 6, 41, 46),
  ('109bac05-fb8f-471f-83d7-5cfafcfa93a0', 'a33845db-e9b9-467f-809d-878d9ec22454', 7, 47, 52),
  ('cc76a38d-b4e9-4058-88e5-18f4eb6887e6', 'a33845db-e9b9-467f-809d-878d9ec22454', 8, 53, 58),
  ('2cae0627-9e45-4a27-8231-090dda45ad12', 'a33845db-e9b9-467f-809d-878d9ec22454', 9, 59, 64),
  ('2a44623d-4c04-4784-8f45-a62bb601341c', 'a33845db-e9b9-467f-809d-878d9ec22454', 10, 65, 70),
  ('77b2481c-8a32-48f4-8504-64bf19ea76ed', 'a33845db-e9b9-467f-809d-878d9ec22454', 11, 71, 76),
  ('f8d93356-d65a-4ace-8b9d-d897ced3cd52', 'a33845db-e9b9-467f-809d-878d9ec22454', 12, 77, 82),
  ('2e4b486e-3bfb-48f6-8e9e-31a1f0fceb74', 'a33845db-e9b9-467f-809d-878d9ec22454', 13, 83, 88),
  ('06fc33a0-0843-4a98-8bc4-ef38ccd1eb10', 'a33845db-e9b9-467f-809d-878d9ec22454', 14, 89, 94),
  ('9321546a-eef0-4447-89f0-8fe4314a99e7', 'a33845db-e9b9-467f-809d-878d9ec22454', 15, 95, 100),
  ('ec7d5e7f-9696-486f-808b-e549a0332c24', 'a33845db-e9b9-467f-809d-878d9ec22454', 16, 101, 106),
  ('e38e02b2-d130-40e6-8a82-426bf2b9a4ff', 'a33845db-e9b9-467f-809d-878d9ec22454', 17, 107, 112),
  ('b27e8ee7-99ef-4868-8ce2-7740ca416064', 'a33845db-e9b9-467f-809d-878d9ec22454', 18, 113, 118),
  ('10418a6b-6e57-4362-8024-83b1d078d33b', 'a33845db-e9b9-467f-809d-878d9ec22454', 19, 119, 124),
  ('3e5c5a12-b869-4959-8e8f-a4778f8aafb0', 'a33845db-e9b9-467f-809d-878d9ec22454', 20, 125, 130),
  ('ae8d4427-4d64-4054-86cc-1a344d675c23', 'a33845db-e9b9-467f-809d-878d9ec22454', 21, 131, 136),
  ('3d8460e0-0e4e-4623-8ed1-1ac705a66b99', 'a33845db-e9b9-467f-809d-878d9ec22454', 22, 137, 142),
  ('c2a62d99-96f2-4e94-8825-c75b66690f14', 'a33845db-e9b9-467f-809d-878d9ec22454', 23, 143, 148),
  ('48b9ef59-3ee8-4138-821e-b9b9e7d0a10e', 'a33845db-e9b9-467f-809d-878d9ec22454', 24, 149, 154),
  ('b06b7c94-1efd-4239-8256-02f10e701273', 'a33845db-e9b9-467f-809d-878d9ec22454', 25, 155, 160),
  ('da124ad9-400a-417f-8e51-9904caab6748', 'a33845db-e9b9-467f-809d-878d9ec22454', 26, 161, 166),
  ('c7944a75-1019-4fef-8a41-d66d2637f00e', 'a33845db-e9b9-467f-809d-878d9ec22454', 27, 167, 172),
  ('f69aa870-2d9f-436b-89c2-6fe5aedc0000', 'a33845db-e9b9-467f-809d-878d9ec22454', 28, 173, 281);

-- 3adim-ayt-biyoloji
insert into public.work (id, publisher, series, subject, exam, kind) values ('19bddc5b-dd9c-4cd2-8084-c2be512bcb7f', 'MEB OGM', '3 Adım Soru Bankası', 'Biyoloji', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('a9edd616-59e7-40ff-84fd-4cd61df863bf', '19bddc5b-dd9c-4cd2-8084-c2be512bcb7f', '9789751160003', null, 170, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('77506026-0116-416a-8388-8a3d6ea56a7f', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 1, 11, 18),
  ('1c4a6336-e0d5-44cf-8cc6-e00cec06623a', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 2, 19, 28),
  ('de2cee74-4b1c-403c-86ce-854952f00e9e', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 3, 29, 36),
  ('d6af8477-bc89-4fd2-8fd4-123f14e73424', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 4, 37, 44),
  ('2dcf86b9-7d20-4d1f-8c3d-b46ed9bca1f7', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 5, 45, 52),
  ('2bf54150-318f-47fb-8bf4-2f8165fbb25b', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 6, 53, 62),
  ('0dc40250-5070-41f1-89c3-190c31731595', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 7, 63, 70),
  ('d6002368-6de7-4052-8c43-7b0931f808f3', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 8, 71, 78),
  ('f21a2da3-1757-4913-8bef-54b172b44be2', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 9, 79, 86),
  ('34d071c6-6104-4768-8a0b-de8a6112ad83', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 10, 87, 94),
  ('9c8d6dbb-de30-4b12-8be9-ce194f7b2cf8', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 11, 95, 102),
  ('30e76a77-ecb8-407c-8783-6636455635ae', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 12, 103, 112),
  ('b9d0e742-6855-4932-8364-c236c1892d56', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 13, 113, 122),
  ('72c84045-074b-40ee-8660-f23348ef4a64', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 14, 123, 130),
  ('face9f09-baae-4bb0-8752-d2147810c65a', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 15, 131, 138),
  ('53793050-db28-45ee-80d1-1f71d7997e29', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 16, 139, 146),
  ('b0a53de7-76cc-4c7f-83ae-996c8f6e682b', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 17, 147, 154),
  ('48a52f0a-3ba4-4609-8246-f8d5d6375ad4', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 18, 155, 160),
  ('74869d92-dbc0-4fdd-8b65-11f3a957f89e', 'a9edd616-59e7-40ff-84fd-4cd61df863bf', 19, 161, 166);

-- 3adim-ayt-cografya
insert into public.work (id, publisher, series, subject, exam, kind) values ('68da92f6-a883-45e2-8f4f-c7fbbc0b6324', 'MEB OGM', '3 Adım Soru Bankası', 'Coğrafya', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('47b563ed-941c-4884-89c7-39dfcc39c93b', '68da92f6-a883-45e2-8f4f-c7fbbc0b6324', '9789751160003', null, 146, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('2ea48938-e487-4655-8279-f907d3fc5bcf', '47b563ed-941c-4884-89c7-39dfcc39c93b', 1, 11, 16),
  ('2b4068b1-bb67-42b5-8a0e-a69e18f9c18e', '47b563ed-941c-4884-89c7-39dfcc39c93b', 2, 17, 22),
  ('c0c121e6-27a0-4583-8eba-3191e7683599', '47b563ed-941c-4884-89c7-39dfcc39c93b', 3, 23, 28),
  ('cd5634c4-a451-45e8-8a98-dc7306862379', '47b563ed-941c-4884-89c7-39dfcc39c93b', 4, 29, 34),
  ('1075c82d-5074-45c8-8007-9eecfb2af008', '47b563ed-941c-4884-89c7-39dfcc39c93b', 5, 35, 40),
  ('0de6baf9-6b67-45fc-8965-689fd5fe7516', '47b563ed-941c-4884-89c7-39dfcc39c93b', 6, 41, 46),
  ('45b3b137-c5f2-4a6c-83cb-f02b9600e58e', '47b563ed-941c-4884-89c7-39dfcc39c93b', 7, 47, 52),
  ('f5697365-0555-4b8f-854d-6d9073aa1ecc', '47b563ed-941c-4884-89c7-39dfcc39c93b', 8, 53, 58),
  ('419c45b8-d473-403f-8a8b-844d9ca13d0d', '47b563ed-941c-4884-89c7-39dfcc39c93b', 9, 59, 64),
  ('bc1a585c-99c7-4a85-8657-b3b74b6df9f1', '47b563ed-941c-4884-89c7-39dfcc39c93b', 10, 65, 70),
  ('39b494c3-a84b-4886-80bf-b57c45a3e8f7', '47b563ed-941c-4884-89c7-39dfcc39c93b', 11, 71, 76),
  ('f0c4c641-6684-4194-85dc-3b2da3500e85', '47b563ed-941c-4884-89c7-39dfcc39c93b', 12, 77, 82),
  ('765c6f03-0c48-4eb2-8797-c34903942939', '47b563ed-941c-4884-89c7-39dfcc39c93b', 13, 83, 88),
  ('2d6ad5ce-663c-4cb8-8489-4647f62c2e78', '47b563ed-941c-4884-89c7-39dfcc39c93b', 14, 89, 94),
  ('f91b543e-7226-434d-8167-eba263d01488', '47b563ed-941c-4884-89c7-39dfcc39c93b', 15, 95, 100),
  ('2bce31ef-a049-4a9c-81a1-64e2fa515c89', '47b563ed-941c-4884-89c7-39dfcc39c93b', 16, 101, 106),
  ('d0aedf7b-b948-49f0-8b29-a8b9e388a566', '47b563ed-941c-4884-89c7-39dfcc39c93b', 17, 107, 112),
  ('b01357fd-2392-4a2e-8387-06c349cba551', '47b563ed-941c-4884-89c7-39dfcc39c93b', 18, 113, 118),
  ('0d1d957e-f186-4575-8ec1-9b9e861eae1f', '47b563ed-941c-4884-89c7-39dfcc39c93b', 19, 119, 124),
  ('e20c9aca-637b-4019-8e6c-3aac3db76ce6', '47b563ed-941c-4884-89c7-39dfcc39c93b', 20, 125, 130),
  ('7713665f-403a-4167-873d-061da65a0194', '47b563ed-941c-4884-89c7-39dfcc39c93b', 21, 131, 136),
  ('7d8c4a82-8b82-4774-8bc0-25fef1d14414', '47b563ed-941c-4884-89c7-39dfcc39c93b', 22, 137, 142);

-- 3adim-ayt-felsefe
insert into public.work (id, publisher, series, subject, exam, kind) values ('2d6ae832-a1e9-4049-81e0-33ec413190ec', 'MEB OGM', '3 Adım Soru Bankası', 'Felsefe Grubu', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('81dfdfe8-6036-42d9-8a33-29b48030d85b', '2d6ae832-a1e9-4049-81e0-33ec413190ec', null, null, 144, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('ced1baba-5517-457f-84ba-13a15b9634de', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 1, 11, 16),
  ('6c39ece8-da61-44a0-8711-eaef6c03acdd', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 2, 17, 22),
  ('3c4fd1f2-908d-433e-813d-1e33b5a152dc', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 3, 23, 28),
  ('fae4927d-e714-4974-8a8f-549eab50dbfe', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 4, 29, 34),
  ('a3578986-25f0-40ea-893d-2fed5c30d1be', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 5, 35, 40),
  ('e1fb5307-9258-4def-84c6-f2675cbc4e98', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 6, 41, 46),
  ('72721719-3d00-4bd6-8580-3b6a579696f0', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 7, 47, 52),
  ('0a5a48e1-9cc4-4b2d-87a1-20d9af169527', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 8, 53, 60),
  ('e1c09536-714a-43ae-8be0-cb785d4e3d0a', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 9, 61, 66),
  ('8fe0231e-c7e9-40b6-80ec-12810c2fa268', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 10, 67, 72),
  ('a302b006-2e86-4f4e-87b9-9f9b9ab013fa', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 11, 73, 78),
  ('5d8e52da-a8ca-4ad0-85e8-345818f6758e', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 12, 79, 84),
  ('41fe75a0-aad0-4691-832a-be463814db15', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 13, 85, 90),
  ('3c2043c7-0f62-4a80-83c0-c9f184711857', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 14, 91, 96),
  ('bc600f30-3721-4cc1-8884-1e21ce43709d', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 15, 97, 102),
  ('86dfd4cc-90b4-4b58-846f-586dea526f7f', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 16, 103, 110),
  ('dfa66ea5-b5ba-45b3-8c98-4d9ddda83a38', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 17, 111, 116),
  ('37fb32c0-4bc6-4d30-8361-7cfb6d0c13eb', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 18, 117, 122),
  ('6602b816-1122-4ca5-8d61-c17fef7ad75c', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 19, 123, 128),
  ('9834b824-cf4e-42bc-8078-fe8e5c3e4ed1', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 20, 129, 134),
  ('9b67787f-6385-48be-804a-4c693eb1a06d', '81dfdfe8-6036-42d9-8a33-29b48030d85b', 21, 135, 140);

-- 3adim-ayt-fizik
insert into public.work (id, publisher, series, subject, exam, kind) values ('d96d837d-4ae2-45b9-8561-f7a682110252', 'MEB OGM', '3 Adım Soru Bankası', 'Fizik', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('7b51e015-4269-4465-83e9-8b06d2f22ceb', 'd96d837d-4ae2-45b9-8561-f7a682110252', '9789751160003', null, 200, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('b6b80381-245d-4f94-82a3-4a5150b25283', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 1, 11, 16),
  ('c639e19a-d9bf-4a0f-8baf-c9d6136f94c0', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 2, 17, 24),
  ('e628e7e4-0d94-4a48-8ed4-34c923eb4379', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 3, 25, 32),
  ('72af9c43-6342-4b01-8fca-03360460140f', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 4, 33, 40),
  ('8de3a48c-9962-4430-866c-f9b8e81b61dc', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 5, 41, 48),
  ('029a35a9-11bc-4012-8e83-23494b50b0be', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 6, 49, 56),
  ('0986d32b-1046-4d73-85cf-b26827ac8977', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 7, 57, 64),
  ('d7ae85f8-ce30-4086-817f-ed966ee25a77', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 8, 65, 72),
  ('3ac84e51-b165-4ed8-8b2c-3f1197c22d66', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 9, 73, 80),
  ('3a2164e8-de4f-44e8-8705-f027c51d1bc4', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 10, 81, 88),
  ('b0e29159-8d5c-4cb9-8a21-5e1ecb442d4e', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 11, 89, 96),
  ('c7ba2a7b-0cb1-4972-833c-4d7259e7c131', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 12, 97, 104),
  ('13e7c7cc-d1ae-4e7a-8e0b-7e4a84672575', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 13, 105, 112),
  ('bd90df8f-dd07-4b27-8252-3eb7590bfa15', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 14, 113, 120),
  ('2ac7d428-2be5-4b13-8592-5074f30f1c26', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 15, 121, 128),
  ('a9cbfb0a-84d9-404a-85d2-cf6814ee8b2d', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 16, 129, 140),
  ('d3d2ffed-7630-4eb4-8604-713478e36a6e', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 17, 141, 148),
  ('33c09e86-f518-4885-8da4-a36a89ead75c', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 18, 149, 156),
  ('4f563b54-4743-4109-83ca-60f9e7991313', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 19, 157, 168),
  ('d309a5e4-1a37-4ef5-8897-2b0963c5d10b', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 20, 169, 176),
  ('f9852256-f466-4962-8b39-90547ebb5763', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 21, 177, 184),
  ('07c59fc0-35fb-43f1-818a-b2c3cf58ed8b', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 22, 185, 192),
  ('100ec726-57d9-4a48-804e-f1dcb06668c3', '7b51e015-4269-4465-83e9-8b06d2f22ceb', 23, 193, 196);

-- 3adim-ayt-kimya
insert into public.work (id, publisher, series, subject, exam, kind) values ('735555cf-b3ca-4b78-8d6e-bcb0f831d575', 'MEB OGM', '3 Adım Soru Bankası', 'Kimya', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('93c195fb-7b22-4261-85a9-8db865d91fa5', '735555cf-b3ca-4b78-8d6e-bcb0f831d575', '9789751160003', null, 208, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('03e4eb9b-3c6f-45dc-8b79-12ee6df74a4a', '93c195fb-7b22-4261-85a9-8db865d91fa5', 1, 11, 22),
  ('36b3e115-b09e-4f29-828d-008c6f333a89', '93c195fb-7b22-4261-85a9-8db865d91fa5', 2, 23, 34),
  ('613821ab-3421-45e6-8572-c266c58f8e6c', '93c195fb-7b22-4261-85a9-8db865d91fa5', 3, 35, 46),
  ('c8a74b55-97b3-4b96-821b-28ded8ac0e27', '93c195fb-7b22-4261-85a9-8db865d91fa5', 4, 47, 58),
  ('b52c6a58-ee8a-4246-8a68-c15674173e71', '93c195fb-7b22-4261-85a9-8db865d91fa5', 5, 59, 68),
  ('2dc642fa-3ecc-461c-8e02-6e88224fdb18', '93c195fb-7b22-4261-85a9-8db865d91fa5', 6, 69, 80),
  ('da0dfedb-0423-407b-81f3-7535e71e386c', '93c195fb-7b22-4261-85a9-8db865d91fa5', 7, 81, 92),
  ('d574a0af-fdf5-4e30-8973-477513208990', '93c195fb-7b22-4261-85a9-8db865d91fa5', 8, 93, 104),
  ('39d7d17a-c20c-4828-8a0a-915335b98256', '93c195fb-7b22-4261-85a9-8db865d91fa5', 9, 105, 116),
  ('845a3dd3-110c-4fda-89e2-aca20956623c', '93c195fb-7b22-4261-85a9-8db865d91fa5', 10, 117, 128),
  ('01acd358-6488-490b-84c8-79f3b4ca3c21', '93c195fb-7b22-4261-85a9-8db865d91fa5', 11, 129, 140),
  ('5adc6469-2e38-414d-885a-4a16bb8ef7b0', '93c195fb-7b22-4261-85a9-8db865d91fa5', 12, 141, 152),
  ('18a21996-110c-4200-871f-997a4816d7f9', '93c195fb-7b22-4261-85a9-8db865d91fa5', 13, 153, 160),
  ('c1818103-78bb-4f81-8c40-60a857307311', '93c195fb-7b22-4261-85a9-8db865d91fa5', 14, 161, 172),
  ('cba9d55b-34b5-4f9b-82c6-9a24e55e5a11', '93c195fb-7b22-4261-85a9-8db865d91fa5', 15, 173, 184),
  ('1c782819-07f7-4478-849d-a3d4fbaecfa2', '93c195fb-7b22-4261-85a9-8db865d91fa5', 16, 185, 202);

-- 3adim-ayt-matematik
insert into public.work (id, publisher, series, subject, exam, kind) values ('1a8e6156-e03d-448e-83ed-24f63683dcba', 'MEB OGM', '3 Adım Soru Bankası', 'Matematik', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('159b726d-d10c-4cb1-816f-e04222bc3515', '1a8e6156-e03d-448e-83ed-24f63683dcba', '9789751160003', null, 214, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('70ec19d2-a8ab-461a-8f55-e3647a12c5a7', '159b726d-d10c-4cb1-816f-e04222bc3515', 1, 11, 16),
  ('286809be-2a9e-4bf6-8f94-fdde51d3fd91', '159b726d-d10c-4cb1-816f-e04222bc3515', 2, 17, 22),
  ('f27b01d3-6bb5-43cc-80ca-78118c7d7e4b', '159b726d-d10c-4cb1-816f-e04222bc3515', 3, 23, 28),
  ('0c2ee1c6-2e59-4473-8b72-df3931a5ec0d', '159b726d-d10c-4cb1-816f-e04222bc3515', 4, 29, 34),
  ('74114d34-3c3b-43d6-894c-df8c53079e89', '159b726d-d10c-4cb1-816f-e04222bc3515', 5, 35, 40),
  ('61439c99-da36-4ef2-84d3-4a046b8750d2', '159b726d-d10c-4cb1-816f-e04222bc3515', 6, 41, 46),
  ('6e62a1fa-5ab2-4fb3-84cd-cab4508e8f93', '159b726d-d10c-4cb1-816f-e04222bc3515', 7, 47, 52),
  ('3c7e0142-8575-47f7-8f53-b25f967ff355', '159b726d-d10c-4cb1-816f-e04222bc3515', 8, 53, 58),
  ('2ec44aed-cecd-4928-8ef6-bd3669b713b4', '159b726d-d10c-4cb1-816f-e04222bc3515', 9, 59, 64),
  ('3c90b419-6b50-4c4d-8c1e-7cd12e0a8c58', '159b726d-d10c-4cb1-816f-e04222bc3515', 10, 65, 70),
  ('5b758601-fb3e-4642-810b-dc7a487ad30a', '159b726d-d10c-4cb1-816f-e04222bc3515', 11, 71, 76),
  ('dec4f02f-6f6e-460a-8803-e9678d964b56', '159b726d-d10c-4cb1-816f-e04222bc3515', 12, 77, 82),
  ('4a1353be-b145-43f6-87ca-870f55e9c1c5', '159b726d-d10c-4cb1-816f-e04222bc3515', 13, 83, 88),
  ('5d109161-58f6-445d-8701-3d4797cb41e1', '159b726d-d10c-4cb1-816f-e04222bc3515', 14, 89, 94),
  ('868ec558-d7a8-4b3f-8856-fe9c6e7612e6', '159b726d-d10c-4cb1-816f-e04222bc3515', 15, 95, 100),
  ('a385ac83-55df-4905-8a64-dd49225bc2d5', '159b726d-d10c-4cb1-816f-e04222bc3515', 16, 101, 106),
  ('e039b906-ea7e-4d03-8496-68ef3f373ea8', '159b726d-d10c-4cb1-816f-e04222bc3515', 17, 107, 112),
  ('3ac659c3-43bf-42db-8162-985212688723', '159b726d-d10c-4cb1-816f-e04222bc3515', 18, 113, 118),
  ('1ee55650-a234-4a07-887c-ca81cdf3ce6f', '159b726d-d10c-4cb1-816f-e04222bc3515', 19, 119, 124),
  ('ebcd75a4-1997-4f19-86ac-1707fb115b8f', '159b726d-d10c-4cb1-816f-e04222bc3515', 20, 125, 130),
  ('6c2562ee-ae54-429b-8374-6d695b4b5b01', '159b726d-d10c-4cb1-816f-e04222bc3515', 21, 131, 136),
  ('60dfe036-0b52-4b16-84d6-bda5ed646ba1', '159b726d-d10c-4cb1-816f-e04222bc3515', 22, 137, 142),
  ('8bee8408-e1ed-4003-8baf-8e9d2b3fab06', '159b726d-d10c-4cb1-816f-e04222bc3515', 23, 143, 148),
  ('4b6f91b5-3498-4410-87ea-8e6f20d92039', '159b726d-d10c-4cb1-816f-e04222bc3515', 24, 149, 154),
  ('fcf353d2-cca3-4041-8378-1c6d357b5377', '159b726d-d10c-4cb1-816f-e04222bc3515', 25, 155, 160),
  ('b744587a-5e97-4f42-8427-f29734bcd6f5', '159b726d-d10c-4cb1-816f-e04222bc3515', 26, 161, 166),
  ('74d2a5a7-37fe-4156-86a1-6a6c015781db', '159b726d-d10c-4cb1-816f-e04222bc3515', 27, 167, 172),
  ('96c31f45-a6d0-41b5-885b-4b1aa7ef7e47', '159b726d-d10c-4cb1-816f-e04222bc3515', 28, 173, 178),
  ('5b6b7a15-28c3-4f9f-8094-443a0bc4078a', '159b726d-d10c-4cb1-816f-e04222bc3515', 29, 179, 184),
  ('fd2b25d5-20c4-4324-8ee5-2588203432df', '159b726d-d10c-4cb1-816f-e04222bc3515', 30, 185, 190),
  ('7289f8f0-c1a0-43c4-84e1-1e0bc0f10476', '159b726d-d10c-4cb1-816f-e04222bc3515', 31, 191, 196),
  ('257d02bb-62a4-4758-87cd-321a9a250ea9', '159b726d-d10c-4cb1-816f-e04222bc3515', 32, 197, 202),
  ('4974f696-b2af-4bda-815d-f003d81f91af', '159b726d-d10c-4cb1-816f-e04222bc3515', 33, 203, 208);

-- 3adim-ayt-tarih
insert into public.work (id, publisher, series, subject, exam, kind) values ('913f5a9f-abdc-474f-889b-3fb97078f277', 'MEB OGM', '3 Adım Soru Bankası', 'Tarih', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('013505ab-632b-4e41-84de-477e88674d4a', '913f5a9f-abdc-474f-889b-3fb97078f277', '9789751160003', null, 172, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('964a22d6-f5a4-4130-8305-8f6f14fbc84b', '013505ab-632b-4e41-84de-477e88674d4a', 1, 11, 16),
  ('4750ecfb-4e11-400c-878c-325ec304fa39', '013505ab-632b-4e41-84de-477e88674d4a', 2, 17, 22),
  ('541a477a-b90f-4fe5-80cd-ec9a9f28d741', '013505ab-632b-4e41-84de-477e88674d4a', 3, 23, 28),
  ('0b2ab91f-57da-4460-8787-1c214dbe6e25', '013505ab-632b-4e41-84de-477e88674d4a', 4, 29, 34),
  ('d0643447-1343-4489-8265-1934e913e781', '013505ab-632b-4e41-84de-477e88674d4a', 5, 35, 40),
  ('6cecc18b-f8b0-4837-8b90-d9a53ff59017', '013505ab-632b-4e41-84de-477e88674d4a', 6, 41, 46),
  ('b19a82c1-4d37-4575-806c-e7633b2f2b9f', '013505ab-632b-4e41-84de-477e88674d4a', 7, 47, 52),
  ('c68827f9-86b0-47f2-874e-830a954a3836', '013505ab-632b-4e41-84de-477e88674d4a', 8, 53, 58),
  ('211f5f24-f69d-4747-85fd-3775eddef6a2', '013505ab-632b-4e41-84de-477e88674d4a', 9, 59, 64),
  ('c65ca4f0-114e-4263-88a7-e059c18b834f', '013505ab-632b-4e41-84de-477e88674d4a', 10, 65, 70),
  ('cbb81c07-df81-448e-8ba8-853826ab6043', '013505ab-632b-4e41-84de-477e88674d4a', 11, 71, 76),
  ('97f03711-5b96-4369-862d-a1bbd0942a54', '013505ab-632b-4e41-84de-477e88674d4a', 12, 77, 82),
  ('6dcad7e2-3863-46f4-812d-99b665eef957', '013505ab-632b-4e41-84de-477e88674d4a', 13, 83, 88),
  ('e33fa351-205f-4af2-88ee-d1b85b2999ef', '013505ab-632b-4e41-84de-477e88674d4a', 14, 89, 94),
  ('bccc96e6-c036-49bf-8e41-18d4645c8281', '013505ab-632b-4e41-84de-477e88674d4a', 15, 95, 100),
  ('a3c32cef-7995-42c9-8a2c-0e9a76795cd4', '013505ab-632b-4e41-84de-477e88674d4a', 16, 101, 106),
  ('d335aef1-f357-488f-82a4-fc4c7ca89a0c', '013505ab-632b-4e41-84de-477e88674d4a', 17, 107, 112),
  ('2d3a2f67-ad7a-4719-8103-6e0e601e9a41', '013505ab-632b-4e41-84de-477e88674d4a', 18, 113, 118),
  ('fe07c6fe-ff1e-4077-8ff5-f067adec1407', '013505ab-632b-4e41-84de-477e88674d4a', 19, 119, 124),
  ('2c3de7ff-6ae7-4dd5-89ad-4fb255058e12', '013505ab-632b-4e41-84de-477e88674d4a', 20, 125, 130),
  ('00a72b99-88cd-4b5d-8371-eda9f7360772', '013505ab-632b-4e41-84de-477e88674d4a', 21, 131, 136),
  ('884fbad6-9ab9-4a10-8573-b73367172e78', '013505ab-632b-4e41-84de-477e88674d4a', 22, 137, 142),
  ('cea75f22-69a5-4fd6-8081-63b4c0c0146b', '013505ab-632b-4e41-84de-477e88674d4a', 23, 143, 148),
  ('c4801459-0c1e-4684-8874-5434840956c6', '013505ab-632b-4e41-84de-477e88674d4a', 24, 149, 154),
  ('0a47a2f3-03ff-44d6-847e-49858cb085f7', '013505ab-632b-4e41-84de-477e88674d4a', 25, 155, 160),
  ('ec66ed91-67be-44b6-8323-ea3c6276c437', '013505ab-632b-4e41-84de-477e88674d4a', 26, 161, 167);

-- 3adim-ayt-edebiyat
insert into public.work (id, publisher, series, subject, exam, kind) values ('80c3cdc4-74c4-4b72-829a-dd4f49898611', 'MEB OGM', '3 Adım Soru Bankası', 'Türk Dili ve Edebiyatı', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('cfbdf31a-c48a-4d69-8274-899faefac362', '80c3cdc4-74c4-4b72-829a-dd4f49898611', '9789751160003', null, 170, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('64b0dcea-430b-40f3-8196-25359376eca5', 'cfbdf31a-c48a-4d69-8274-899faefac362', 1, 11, 16),
  ('0fdb755b-3536-44ff-8ab0-f27fd6031da8', 'cfbdf31a-c48a-4d69-8274-899faefac362', 2, 17, 22),
  ('54f9dddd-7320-4a2a-8f30-3468d2e1bf98', 'cfbdf31a-c48a-4d69-8274-899faefac362', 3, 23, 28),
  ('079a24c1-7ef9-4067-80e3-f67e9563da6d', 'cfbdf31a-c48a-4d69-8274-899faefac362', 4, 29, 34),
  ('fc1e4d37-97cd-4311-83f6-6e862969f800', 'cfbdf31a-c48a-4d69-8274-899faefac362', 5, 35, 40),
  ('13570ba6-34f7-4f3b-8190-417d4213d6fb', 'cfbdf31a-c48a-4d69-8274-899faefac362', 6, 41, 46),
  ('599bcd2e-1e2c-42c1-8e9a-364872aa490a', 'cfbdf31a-c48a-4d69-8274-899faefac362', 7, 47, 52),
  ('ca772604-7118-46ac-8687-e9305daf124f', 'cfbdf31a-c48a-4d69-8274-899faefac362', 8, 53, 58),
  ('baea6688-b2b3-4807-8740-03017c725435', 'cfbdf31a-c48a-4d69-8274-899faefac362', 9, 59, 64),
  ('55817640-3e6a-4312-8153-6cd4ef0e7e9d', 'cfbdf31a-c48a-4d69-8274-899faefac362', 10, 65, 70),
  ('e9d9518a-eef4-4a8c-898a-51086e8b36dd', 'cfbdf31a-c48a-4d69-8274-899faefac362', 11, 71, 76),
  ('66851e84-b251-4dd8-860d-183007eb1098', 'cfbdf31a-c48a-4d69-8274-899faefac362', 12, 77, 82),
  ('551b9da1-55e2-4bf4-8699-af73494387c5', 'cfbdf31a-c48a-4d69-8274-899faefac362', 13, 83, 88),
  ('13d02580-4892-47fa-840c-688763467ec1', 'cfbdf31a-c48a-4d69-8274-899faefac362', 14, 89, 94),
  ('6cec2c47-95ba-47f3-84d0-cfe2cb5b87ef', 'cfbdf31a-c48a-4d69-8274-899faefac362', 15, 95, 100),
  ('aa751d14-0d33-497a-89bf-fdcf7ae8d55d', 'cfbdf31a-c48a-4d69-8274-899faefac362', 16, 101, 106),
  ('a5705be5-9d66-4dc7-8bcd-f95131459bbc', 'cfbdf31a-c48a-4d69-8274-899faefac362', 17, 107, 112),
  ('24b1c9df-dd18-462c-892e-825452642aef', 'cfbdf31a-c48a-4d69-8274-899faefac362', 18, 113, 118),
  ('fe4d878a-6faa-4f11-8c2b-09bfec9573b6', 'cfbdf31a-c48a-4d69-8274-899faefac362', 19, 119, 124),
  ('eee2f0f1-ac9f-44b0-8edb-375a240c7e6d', 'cfbdf31a-c48a-4d69-8274-899faefac362', 20, 125, 130),
  ('4fc5a968-146c-4236-8616-19904a985e7c', 'cfbdf31a-c48a-4d69-8274-899faefac362', 21, 131, 136),
  ('0439913b-2ced-4f6d-8cf8-4f9375f13fcb', 'cfbdf31a-c48a-4d69-8274-899faefac362', 22, 137, 142),
  ('42e8c741-d5df-4d1e-8b18-5b5699731fef', 'cfbdf31a-c48a-4d69-8274-899faefac362', 23, 143, 148),
  ('9d102093-ea56-4ff6-84d2-1a1b18b1bd22', 'cfbdf31a-c48a-4d69-8274-899faefac362', 24, 149, 154),
  ('17aad584-5c8c-46b8-8311-8ab7ff828810', 'cfbdf31a-c48a-4d69-8274-899faefac362', 25, 155, 160),
  ('a5f81697-0f8c-482c-8ae6-ea036710795c', 'cfbdf31a-c48a-4d69-8274-899faefac362', 26, 161, 166);

-- 3adim-ydt-ingilizce
insert into public.work (id, publisher, series, subject, exam, kind) values ('0e69b75e-985d-402c-8a9c-353d29d4dfa2', 'MEB OGM', '3 Adım Soru Bankası', 'İngilizce', 'YDT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('00eb4838-b3f2-4f00-83f5-0f3d486b33a6', '0e69b75e-985d-402c-8a9c-353d29d4dfa2', '9789751172587', null, 280, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('63ad9f9a-19c9-43ec-8037-85b10a9f52d0', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 1, 11, 28),
  ('fd58a27e-a3de-492d-81e6-a4045068fe1f', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 2, 29, 60),
  ('0de0327f-f4a0-416d-8c2e-c7a4d9991e39', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 3, 61, 78),
  ('4ce0da35-3df2-4981-81d5-f9c5780440a5', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 4, 79, 98),
  ('b3da7efd-1601-46ab-8c13-d16524b50ed4', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 5, 99, 132),
  ('d1d0af8c-a72c-42a3-8061-3dbe01ccde44', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 6, 133, 152),
  ('59943a45-c9d6-4950-82e6-b9cb2baf846c', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 7, 153, 172),
  ('e3c99cbd-199f-476f-85bb-639c1082edaf', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 8, 173, 192),
  ('654d8a13-f843-483e-8db1-88e0fdf4a76f', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 9, 193, 212),
  ('db610a60-0ec6-41d6-8063-265c17bd4a67', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 10, 213, 234),
  ('cf54adc2-778a-4b64-82aa-024583e51c64', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 11, 235, 256),
  ('4d396f8f-036e-41e5-884e-2dff4c72e96c', '00eb4838-b3f2-4f00-83f5-0f3d486b33a6', 12, 257, 276);

-- konu-pekistirme-tyt-biyoloji
insert into public.work (id, publisher, series, subject, exam, kind) values ('d4fb2744-4a9a-4965-8933-0d39889d87e4', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Biyoloji', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('76b46821-c348-4ba1-81e7-e3853a421a74', 'd4fb2744-4a9a-4965-8933-0d39889d87e4', '9789751172624', null, 262, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('413b34c8-7bef-4590-8376-fa1a243e6a33', '76b46821-c348-4ba1-81e7-e3853a421a74', 1, 9, 18),
  ('21c16898-6e5c-43d6-8185-769b360972d3', '76b46821-c348-4ba1-81e7-e3853a421a74', 2, 19, 28),
  ('f4fe3aeb-29de-40b5-84e2-27883eccf711', '76b46821-c348-4ba1-81e7-e3853a421a74', 3, 29, 42),
  ('fb76c400-8dc6-4234-86bc-17545fa54537', '76b46821-c348-4ba1-81e7-e3853a421a74', 4, 43, 54),
  ('f1a183f8-5a0b-453a-804f-c6b270e0941d', '76b46821-c348-4ba1-81e7-e3853a421a74', 5, 55, 64),
  ('3814c061-5a8f-47be-813f-f86f2974f542', '76b46821-c348-4ba1-81e7-e3853a421a74', 6, 65, 84),
  ('a8d350bd-4b53-4570-8b89-18e6d8ffe25d', '76b46821-c348-4ba1-81e7-e3853a421a74', 7, 85, 96),
  ('dd643c9e-fd3d-4cc0-8cc7-a3d754a94914', '76b46821-c348-4ba1-81e7-e3853a421a74', 8, 97, 108),
  ('174ef140-9241-4393-83dd-7bd3789f3272', '76b46821-c348-4ba1-81e7-e3853a421a74', 9, 109, 128),
  ('e5b68d03-301e-4b1e-80b1-9dbe390af5fb', '76b46821-c348-4ba1-81e7-e3853a421a74', 10, 129, 142),
  ('0554b928-1b8c-4ead-8966-0813223beee2', '76b46821-c348-4ba1-81e7-e3853a421a74', 11, 143, 156),
  ('defab617-736b-40d6-8aa7-c01504910276', '76b46821-c348-4ba1-81e7-e3853a421a74', 12, 157, 172),
  ('edc98d8f-8a6b-465d-8293-1625d3ff4294', '76b46821-c348-4ba1-81e7-e3853a421a74', 13, 173, 184),
  ('534f1e28-58ec-470b-8084-c38ae2f89303', '76b46821-c348-4ba1-81e7-e3853a421a74', 14, 185, 194),
  ('2bf48832-5a64-41e6-8073-143a7b8c7b2a', '76b46821-c348-4ba1-81e7-e3853a421a74', 15, 195, 218),
  ('e51da9a4-542a-4e0e-838d-eb78739c5b32', '76b46821-c348-4ba1-81e7-e3853a421a74', 16, 219, 232),
  ('b5628f58-a9c8-4c16-8099-47eb88ea443d', '76b46821-c348-4ba1-81e7-e3853a421a74', 17, 233, 246),
  ('b5c6b20c-73b3-4589-817d-a4e69f67ed38', '76b46821-c348-4ba1-81e7-e3853a421a74', 18, 247, 258);

-- konu-pekistirme-tyt-cografya
insert into public.work (id, publisher, series, subject, exam, kind) values ('9fc7b3e9-c513-48d0-8d00-dea709845aa7', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Coğrafya', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('b700a01b-5d98-43f5-8d42-2f84e5809cbd', '9fc7b3e9-c513-48d0-8d00-dea709845aa7', '9789751172556', null, 266, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('76b5ae6a-fd4f-485d-8e5c-b89162bdca7d', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 1, 9, 24),
  ('16b998ab-2ed1-4055-8e18-be15ce41ab50', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 2, 25, 42),
  ('458c14b2-1379-4bba-81fa-8c7429adef49', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 3, 43, 58),
  ('c70f1679-3c82-499a-8eee-c8724e2252b9', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 4, 59, 72),
  ('e929a36b-be77-4efc-8149-49d23050d02e', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 5, 73, 86),
  ('40325674-ff78-46b9-8948-d4369624b8de', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 6, 87, 98),
  ('19d36525-f6c7-4488-8514-59204bb1584e', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 7, 99, 112),
  ('7b31f0a9-19da-46b7-809d-e4f4f695bbae', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 8, 113, 126),
  ('8141f7fd-1b2a-4110-8448-5eae0b65ca5b', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 9, 127, 138),
  ('0b4809c2-b563-4a07-8d0f-15a968b927d2', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 10, 139, 152),
  ('0306ab2e-e4b1-4be6-801f-5cd73d9b9e40', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 11, 153, 164),
  ('6b092535-90f4-4a18-8cc3-43f3d14957df', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 12, 165, 178),
  ('844f8c93-2ce9-471f-8488-63fa32d61365', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 13, 179, 190),
  ('d60f6977-7389-4517-82db-7ac5f3db1536', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 14, 191, 204),
  ('791a7075-974c-44ed-8c7a-f12cd1c85ae0', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 15, 205, 218),
  ('31b738f4-5cad-424a-80a0-6f770337c7ca', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 16, 219, 232),
  ('4e2975d4-9b7c-4f13-8ffe-ef489cf4bba8', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 17, 233, 248),
  ('ea971afd-5875-4637-8535-d87504a67de4', 'b700a01b-5d98-43f5-8d42-2f84e5809cbd', 18, 249, 262);

-- konu-pekistirme-tyt-felsefe
insert into public.work (id, publisher, series, subject, exam, kind) values ('b4fb3f3f-6755-469a-864c-569e51c7b8f1', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Felsefe', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('ed96497b-2c43-4979-8795-9ceee3e917ba', 'b4fb3f3f-6755-469a-864c-569e51c7b8f1', '9789751172631', null, 283, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('98ddcdf6-9b32-4b41-890c-9a7b8fbd78e0', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 1, 9, 24),
  ('a80f9f4e-ffb1-4756-82f6-9933e1646a03', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 2, 25, 40),
  ('7f72d22b-14ba-45fc-8414-248d5214d68d', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 3, 41, 56),
  ('02fc4219-2846-4c5c-8f82-4595809f2e45', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 4, 57, 72),
  ('39909e62-561a-459d-8305-c2917318cba5', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 5, 73, 88),
  ('44b8c15b-b697-43d2-896d-a2de77094eae', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 6, 89, 104),
  ('05c6b177-10b3-4750-806c-9455afcaeaae', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 7, 105, 118),
  ('9acc9529-b973-48fb-806c-abf1533d51cc', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 8, 119, 134),
  ('a0acf624-4e69-4acd-8b58-3bab7306869e', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 9, 135, 150),
  ('f521e72a-c125-4a66-8fc5-331e33e561f2', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 10, 151, 166),
  ('46a5b080-2cf8-4a84-8fa7-02c4f14c341c', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 11, 167, 182),
  ('0567c7c8-f077-4607-8b6d-9b9c5c1861b2', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 12, 183, 198),
  ('90009af6-1483-426f-8b43-09a04d6e3b35', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 13, 199, 214),
  ('0c201684-bfc7-416d-8020-9cac5eaf4ab0', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 14, 215, 230),
  ('ff9d98df-d15c-46f5-82d2-37083177900e', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 15, 231, 246),
  ('306535fe-ba14-47f8-8c0a-02e81b5581fb', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 16, 247, 262),
  ('ce569181-0b01-42bf-842f-8ecab1ea05f5', 'ed96497b-2c43-4979-8795-9ceee3e917ba', 17, 263, 278);

-- konu-pekistirme-tyt-fizik
insert into public.work (id, publisher, series, subject, exam, kind) values ('627dbff6-c46d-4b3e-804d-89527bb19b04', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Fizik', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('fa26d3a9-1dbf-4661-8fde-65795fdedd99', '627dbff6-c46d-4b3e-804d-89527bb19b04', '9789751172648', null, 364, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('f9d5263d-a236-4e4c-8e9a-45611a90dded', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 1, 9, 18),
  ('0d237291-6fd1-4e68-86bd-2d1b60ad893b', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 2, 19, 36),
  ('55b4357a-9de7-4dd8-82bf-17cdd5abf8ca', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 3, 37, 58),
  ('0a2982e7-e695-44c5-87e2-68c25917d445', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 4, 59, 78),
  ('dc940b37-a69e-4ad8-877e-cf635ef1d287', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 5, 79, 112),
  ('8b3764e9-aa41-4356-8830-fd1c0d339e65', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 6, 113, 132),
  ('a9113a02-8ab9-4754-8bd1-a60492c75387', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 7, 133, 154),
  ('792e893c-46fa-417c-85a6-a42e7b4edbca', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 8, 155, 196),
  ('981bfab1-fdd9-43f3-85e0-9b8f2186b55c', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 9, 197, 220),
  ('0de06c1f-2c84-416b-8221-59963f5c2acb', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 10, 221, 246),
  ('3dcceee6-9a10-4a16-8d0c-e2f366b0f10b', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 11, 247, 298),
  ('7b7a2334-c28e-410a-83e6-6c05c706fd1c', 'fa26d3a9-1dbf-4661-8fde-65795fdedd99', 12, 299, 360);

-- konu-pekistirme-tyt-kimya
insert into public.work (id, publisher, series, subject, exam, kind) values ('5c2d86f3-58a9-4b3b-835e-d431c66d0cfa', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Kimya', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('300ffe60-fb5b-427a-8de0-99e14ba773d3', '5c2d86f3-58a9-4b3b-835e-d431c66d0cfa', '9789751172679', null, 322, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('8dd6db9e-21c7-47ee-8c76-f825774209f6', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 1, 9, 24),
  ('e9984064-0f03-4188-87c9-b392e01152da', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 2, 25, 50),
  ('df55d964-d9d5-4dae-84f7-2445a49fcd1c', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 3, 51, 66),
  ('316f8958-4f25-4dc4-8e24-c2ee1a45535f', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 4, 67, 92),
  ('e114ee61-c4fc-4f5f-84b4-ce5af0f7d78a', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 5, 93, 130),
  ('980bc19c-0aae-4ef1-8f2c-58d8e93c7ab7', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 6, 131, 160),
  ('2d433836-1509-41e9-8228-49089b44c2fe', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 7, 161, 180),
  ('e6bd1b53-d614-4458-89b3-fd033f2dfca3', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 8, 181, 200),
  ('e87b1e1d-e3da-4f24-81df-272dbe0ab2e7', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 9, 201, 218),
  ('a66564ea-44c8-4410-8825-8bbdfef56c0a', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 10, 219, 250),
  ('6145b231-51ac-42c7-898c-965ae98b90c7', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 11, 251, 288),
  ('d66b1331-de24-40de-8fc0-b1438f219751', '300ffe60-fb5b-427a-8de0-99e14ba773d3', 12, 289, 318);

-- konu-pekistirme-tyt-matematik
insert into public.work (id, publisher, series, subject, exam, kind) values ('539aadab-9fea-4e83-889b-bcf53f8f1adf', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Matematik', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('7a66b723-00f5-4726-8a56-f8d07553a543', '539aadab-9fea-4e83-889b-bcf53f8f1adf', '9789751172570', null, 558, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('902fa7b6-715a-4c2e-8513-a1f531254883', '7a66b723-00f5-4726-8a56-f8d07553a543', 1, 9, 24),
  ('13794f16-dd5c-4f0a-8d62-5c66fcf7382e', '7a66b723-00f5-4726-8a56-f8d07553a543', 2, 25, 36),
  ('44e77b33-6efc-448f-8745-703b4da7946b', '7a66b723-00f5-4726-8a56-f8d07553a543', 3, 37, 52),
  ('2e8fae3b-3d74-499b-8123-0e5be1efb940', '7a66b723-00f5-4726-8a56-f8d07553a543', 4, 53, 64),
  ('be36c3e9-5e2c-4739-8568-984749c418b1', '7a66b723-00f5-4726-8a56-f8d07553a543', 5, 65, 80),
  ('a4b51142-9f4c-4a15-8029-617960cd855c', '7a66b723-00f5-4726-8a56-f8d07553a543', 6, 81, 108),
  ('60a07caf-e891-4b0d-8b1d-59161ae626f0', '7a66b723-00f5-4726-8a56-f8d07553a543', 7, 109, 124),
  ('38e0f7c8-9018-4898-8750-06264bcf2767', '7a66b723-00f5-4726-8a56-f8d07553a543', 8, 125, 166),
  ('3a910e68-01cb-4948-8169-c2f52f53bbe1', '7a66b723-00f5-4726-8a56-f8d07553a543', 9, 167, 180),
  ('2e9dd891-254f-4f6c-8fb7-d074c8c2c87e', '7a66b723-00f5-4726-8a56-f8d07553a543', 10, 181, 210),
  ('6c1d7962-a80b-4270-863a-edb18344fc55', '7a66b723-00f5-4726-8a56-f8d07553a543', 11, 211, 232),
  ('cfe56cfe-9152-47ca-8c04-380722400a53', '7a66b723-00f5-4726-8a56-f8d07553a543', 12, 233, 252),
  ('bf17387b-0c60-4e92-8adb-377bb2f234f7', '7a66b723-00f5-4726-8a56-f8d07553a543', 13, 253, 272),
  ('543cb493-e59b-494b-8db3-bff11855bd7a', '7a66b723-00f5-4726-8a56-f8d07553a543', 14, 273, 286),
  ('01e4abce-f9a8-43d4-8b20-f7fd97d3b92a', '7a66b723-00f5-4726-8a56-f8d07553a543', 15, 287, 302),
  ('b71cf277-1447-4256-8940-7dc41d237128', '7a66b723-00f5-4726-8a56-f8d07553a543', 16, 303, 328),
  ('aa200d0c-12c9-4ffc-8645-6d367f068ba0', '7a66b723-00f5-4726-8a56-f8d07553a543', 17, 329, 342),
  ('f1d6a0ff-f384-4d7a-8cc6-c5da5cdff7c6', '7a66b723-00f5-4726-8a56-f8d07553a543', 18, 343, 362),
  ('8bc3a0ba-e584-43ce-87f6-e3414d3d8c5d', '7a66b723-00f5-4726-8a56-f8d07553a543', 19, 363, 388),
  ('ec776121-2c44-4c11-8de9-dd5a81484fb2', '7a66b723-00f5-4726-8a56-f8d07553a543', 20, 389, 402),
  ('aa19df97-5fa3-48c5-8708-21c7884c43b0', '7a66b723-00f5-4726-8a56-f8d07553a543', 21, 403, 420),
  ('1201313a-ae68-493d-8ee0-c6b6119d6034', '7a66b723-00f5-4726-8a56-f8d07553a543', 22, 421, 456),
  ('4b0e56be-aed0-4ece-813b-145251fc40c6', '7a66b723-00f5-4726-8a56-f8d07553a543', 23, 457, 476),
  ('52fa2678-392c-459a-8000-91dd69dca20f', '7a66b723-00f5-4726-8a56-f8d07553a543', 24, 477, 524),
  ('886c9129-958e-4bad-87ed-71c9a43fa169', '7a66b723-00f5-4726-8a56-f8d07553a543', 25, 525, 552);

-- konu-pekistirme-tyt-tarih
insert into public.work (id, publisher, series, subject, exam, kind) values ('0c3f2964-c5d3-4144-8601-c589fff90e7a', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Tarih', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', '0c3f2964-c5d3-4144-8601-c589fff90e7a', null, null, 248, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('5cafa38f-1d25-4cd3-84a4-a0ca92b299e7', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 1, 9, 20),
  ('30e3287e-b655-4db0-8df3-5761a322cc21', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 2, 21, 34),
  ('5de8412a-5570-491a-8682-d46562a4a60a', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 3, 35, 52),
  ('d6634ca1-bf1d-40a8-89eb-e677172399d5', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 4, 53, 64),
  ('56bdad79-62b8-4f47-8b15-17e9a7d45e2f', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 5, 65, 76),
  ('33b99b0d-5f1e-4fb1-8483-b6c62a514f7a', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 6, 77, 88),
  ('3935c3a5-8743-4bdd-82ee-8e5ed82641a4', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 7, 89, 100),
  ('f9471ed0-1cef-4113-88db-170e14b08dc0', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 8, 101, 112),
  ('bc590c46-d814-4c08-85a8-c3f51889f682', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 9, 113, 124),
  ('564785ad-2097-43b3-8286-855c39bb9098', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 10, 125, 136),
  ('6a7de279-80c2-44a7-8fcc-32618c446224', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 11, 137, 148),
  ('91ee70a9-8a56-498d-85d6-30259e443d21', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 12, 149, 160),
  ('3ec39951-9450-470d-8340-9ac8a2c12b78', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 13, 161, 172),
  ('cb22e31c-7034-4f7c-8aff-ee074092e2b9', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 14, 173, 184),
  ('e7bf0c2a-0cc5-4510-8ca5-ec055accedd5', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 15, 185, 198),
  ('2e6452c3-42dd-421f-82ef-ca90cb147b77', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 16, 199, 210),
  ('d96ab4b0-5966-4faa-8e72-3b4194b075b9', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 17, 211, 220),
  ('f58a78c8-9118-47bb-886a-1756517b42a3', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 18, 221, 232),
  ('f7e4ec11-bc80-4aea-8004-663a44086267', '94cd6ee6-7ed5-40bb-85fb-fa24ea00f983', 19, 233, 244);

-- konu-pekistirme-tyt-tde
insert into public.work (id, publisher, series, subject, exam, kind) values ('926dddf2-1977-4da3-8aca-1681840ede17', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Türk Dili ve Edebiyatı', 'TYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', '926dddf2-1977-4da3-8aca-1681840ede17', '9789751172600', null, 182, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('5572c579-c46e-456f-81cf-1864b2621330', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 1, 9, 20),
  ('b2f21fad-5e0b-4112-8fdd-316a7265c8a1', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 2, 21, 32),
  ('6b3006cf-e144-4f3d-8af5-04de73c6c918', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 3, 33, 44),
  ('d93bc815-7389-4db9-8040-ae1ff4d75bf1', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 4, 45, 54),
  ('5b526160-0baf-48f5-89df-58d9afa1244d', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 5, 55, 64),
  ('2787e4e9-6a2e-4cfd-8373-e16bf2ee2d46', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 6, 65, 86),
  ('12dc8d6e-40d7-40c3-8978-1685144538f8', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 7, 87, 108),
  ('709d41d8-fdcd-4933-86cd-dc6049b57ce3', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 8, 109, 122),
  ('9a7c4059-c409-4cd2-80fa-c1c1aaae40fe', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 9, 123, 134),
  ('8bffc8a7-2c84-4fbe-8f3d-9e0f8febbb36', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 10, 135, 146),
  ('25f9462d-814e-4793-81ba-3846f8cf2168', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 11, 147, 158),
  ('781e9f54-cd01-47ed-879e-f881e45c3e89', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 12, 159, 168),
  ('1832e0c8-3929-433f-827d-bbfbe1b5fcc9', 'c4df809b-586f-4f53-8e3a-f4bf0d0ecb2b', 13, 169, 178);

-- konu-pekistirme-ayt-biyoloji
insert into public.work (id, publisher, series, subject, exam, kind) values ('c8c5925b-abc3-401a-8dad-fdca7353e6a5', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Biyoloji', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('62e4f28c-ab03-469d-8d22-930d0307e442', 'c8c5925b-abc3-401a-8dad-fdca7353e6a5', '9789751172662', null, 286, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('d33deecc-7d60-4504-89d1-75d3b24ec982', '62e4f28c-ab03-469d-8d22-930d0307e442', 1, 9, 22),
  ('e2cbe1a7-b927-444d-89b9-dbb8812c270c', '62e4f28c-ab03-469d-8d22-930d0307e442', 2, 23, 32),
  ('ca5eebcf-4192-49bd-8c8e-7858b940835c', '62e4f28c-ab03-469d-8d22-930d0307e442', 3, 33, 42),
  ('2ed5af2c-1ff2-4603-88fb-8343627c4424', '62e4f28c-ab03-469d-8d22-930d0307e442', 4, 43, 56),
  ('1461557b-b25a-4ba9-8321-45bb6dc4205e', '62e4f28c-ab03-469d-8d22-930d0307e442', 5, 57, 74),
  ('65ffc859-ebb4-4d37-8a50-1541cd9e382f', '62e4f28c-ab03-469d-8d22-930d0307e442', 6, 75, 92),
  ('5ecb5499-b683-4df8-8d5d-8d324f068f15', '62e4f28c-ab03-469d-8d22-930d0307e442', 7, 93, 102),
  ('2d839c6d-fe9d-47af-88e2-6f941545d7f9', '62e4f28c-ab03-469d-8d22-930d0307e442', 8, 103, 116),
  ('2cf080a6-bd77-4e08-837c-d7ec25ef4909', '62e4f28c-ab03-469d-8d22-930d0307e442', 9, 117, 130),
  ('5527e2dd-80a5-4e39-8134-ae4ca000e15a', '62e4f28c-ab03-469d-8d22-930d0307e442', 10, 131, 146),
  ('38bfb98f-68f3-448c-8ba5-a228fde3f56a', '62e4f28c-ab03-469d-8d22-930d0307e442', 11, 147, 158),
  ('bd05e3ab-a8d8-4384-8195-629969fbe5d8', '62e4f28c-ab03-469d-8d22-930d0307e442', 12, 159, 168),
  ('aaa802e6-a813-4e0c-86ad-23e596edba9f', '62e4f28c-ab03-469d-8d22-930d0307e442', 13, 169, 182),
  ('d652b514-5b8e-42fa-8889-25f4473b7db7', '62e4f28c-ab03-469d-8d22-930d0307e442', 14, 183, 194),
  ('e87be77c-ec7b-4574-8eb1-7fcf9bfb6e4c', '62e4f28c-ab03-469d-8d22-930d0307e442', 15, 195, 206),
  ('29294af3-533b-4c27-8a71-171e00279c3d', '62e4f28c-ab03-469d-8d22-930d0307e442', 16, 207, 220),
  ('60224f9d-c5f4-4e77-865e-a2bb65aecf86', '62e4f28c-ab03-469d-8d22-930d0307e442', 17, 221, 236),
  ('f0708312-33ad-428f-848a-c85e17cda28c', '62e4f28c-ab03-469d-8d22-930d0307e442', 18, 237, 248),
  ('2997d923-1572-4cbb-8ad4-48e375836c17', '62e4f28c-ab03-469d-8d22-930d0307e442', 19, 249, 260),
  ('cf392da0-c01f-4719-8e90-86387ca43cdc', '62e4f28c-ab03-469d-8d22-930d0307e442', 20, 261, 272),
  ('0ad52938-a7cd-44da-88bc-5c75ebeb52b5', '62e4f28c-ab03-469d-8d22-930d0307e442', 21, 273, 282);

-- konu-pekistirme-ayt-cografya
insert into public.work (id, publisher, series, subject, exam, kind) values ('f2d61df7-a012-4a36-8d85-58875a4ced07', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Coğrafya', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 'f2d61df7-a012-4a36-8d85-58875a4ced07', null, null, 252, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('e5c6f297-a6a4-493a-8294-c7d851038328', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 1, 9, 22),
  ('18c05d18-9f77-41de-827e-d572fa2fa949', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 2, 23, 36),
  ('c4ced838-9545-4d25-89c4-a6383cfa8a3c', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 3, 37, 48),
  ('9018ae24-f61d-4242-8eee-2f2885e216b1', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 4, 49, 60),
  ('a1de71e4-16ee-4a61-8a19-aec8b6b5f01c', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 5, 61, 74),
  ('9db9bd10-6e61-43f8-85a7-c25882769e9a', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 6, 75, 88),
  ('cf8c32d0-ed29-41f9-8c36-205eb91f6724', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 7, 89, 102),
  ('ca96ef1e-4d80-4f7c-8d6c-e6197f8dd10f', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 8, 103, 116),
  ('8a12238c-54ec-42bf-8673-b7927f2add99', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 9, 117, 130),
  ('86eb6dee-d033-4498-87dd-c892d86d22e6', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 10, 131, 142),
  ('c1d8a939-da0a-44c9-853b-ca00c1d16ff5', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 11, 143, 156),
  ('7af4ec0e-46ec-457a-80b4-72103eebb173', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 12, 157, 170),
  ('0c5b22f3-fb95-4136-8cf1-3e4841eb507c', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 13, 171, 182),
  ('e40f8931-5c75-4902-8d0c-7f1374ffc018', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 14, 183, 196),
  ('ffac8891-eb92-49c7-8e0d-3daee97e099a', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 15, 197, 210),
  ('8364b739-af7b-41a5-8c16-348a2539326d', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 16, 211, 222),
  ('e005136f-4d7b-4c45-886a-56df6bf3463b', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 17, 223, 236),
  ('066b51fb-db20-4014-8b02-a0634b7d1916', 'c8ac9fd4-3c22-45cc-8301-0c5f5a53236a', 18, 237, 248);

-- konu-pekistirme-ayt-fizik
insert into public.work (id, publisher, series, subject, exam, kind) values ('8cc6e356-1ed9-4d2e-862f-a1a124a24189', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Fizik', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('8234b0f8-edb2-418d-8275-125be5d9f8b0', '8cc6e356-1ed9-4d2e-862f-a1a124a24189', '9789751172655', null, 420, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('cf31b06a-07d4-4f64-89f2-de817968fba6', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 1, 9, 24),
  ('1ede6431-b595-45e0-8ac5-75c22a56f00f', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 2, 25, 38),
  ('3dab193b-15c2-42c8-8cb4-7748cfc44005', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 3, 39, 60),
  ('db7672ee-4b4f-4aab-8b85-c4ced1f96554', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 4, 61, 78),
  ('6b87959b-c3cd-4288-8903-141a18a923b9', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 5, 79, 96),
  ('343887ef-bd97-42fd-8a53-b07766a7e87f', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 6, 97, 114),
  ('be96f39f-bd32-46ff-81a7-8145c96506b7', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 7, 115, 132),
  ('e6485dc9-919a-4584-89b1-37cdf3794fa6', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 8, 133, 148),
  ('584c30c1-1647-41c8-8c16-7aaba3879962', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 9, 149, 164),
  ('a48f8cfe-fd65-4469-8630-1b3987935f39', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 10, 165, 182),
  ('b128fd3a-eaf3-44b8-8e0e-3cc86950f12a', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 11, 183, 196),
  ('bbb8cf88-ec7d-432b-87cf-12f911ff1bb6', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 12, 197, 210),
  ('da597f96-592b-4c2c-845a-618a6f65224c', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 13, 211, 234),
  ('ce28e0eb-53a5-4178-875b-775196c384fc', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 14, 235, 246),
  ('f290b181-6f66-48c6-8ed2-c92dc606afe7', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 15, 247, 264),
  ('050b9aae-1160-4b1d-8db7-ec7c72c74d5d', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 16, 265, 278),
  ('3f3e5c57-5e2f-46c8-8229-0ce6fb84892c', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 17, 279, 298),
  ('e412d384-0540-4ca1-889c-e034e0092647', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 18, 299, 316),
  ('8e3d12ae-7b0e-4a45-8c9e-47f6674b0488', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 19, 317, 326),
  ('f23e9c8b-09be-47d7-8792-1f1738652c9e', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 20, 327, 340),
  ('77c52e15-7c5c-4911-804a-365fd98f8b5f', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 21, 341, 350),
  ('5f3a4532-d0b4-4625-881e-9b7b74ad36cf', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 22, 351, 362),
  ('b5e2a120-7681-47d6-89e6-9f2805956254', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 23, 363, 374),
  ('33f247a9-71ac-498d-8d4a-5b2991141788', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 24, 375, 390),
  ('5366e925-a462-47c3-80b2-aaadb81c40dd', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 25, 391, 402),
  ('4cf5b04c-f050-4b4c-8d9f-aa54baa76083', '8234b0f8-edb2-418d-8275-125be5d9f8b0', 26, 403, 414);

-- konu-pekistirme-ayt-kimya
insert into public.work (id, publisher, series, subject, exam, kind) values ('58d9a680-a7b9-4292-8fb9-29618e223401', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Kimya', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('b21b65b4-81a7-44d3-864b-d841ead654f9', '58d9a680-a7b9-4292-8fb9-29618e223401', '9789751172686', null, 454, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('ffaa1116-5d5c-4ff2-871f-56be066a8901', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 1, 9, 26),
  ('7f66cf43-cf91-46c0-841f-743ff68f0b6b', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 2, 27, 48),
  ('46c193bc-12b2-4cf1-886a-4c80a272cf05', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 3, 49, 68),
  ('2c937e96-1183-43c9-8559-07978010a968', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 4, 69, 90),
  ('a1aba2a2-f313-49a3-8f7d-7e5a8b2b8606', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 5, 91, 114),
  ('711ff2c6-8764-4f8d-80ac-a287eb021222', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 6, 115, 136),
  ('46503f18-5d95-4e23-8d18-ebe1c47406cd', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 7, 137, 174),
  ('6cc2cd7b-99b7-4ae8-8002-3406add519d4', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 8, 175, 210),
  ('23d14797-900d-4794-88fe-7994273b1f96', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 9, 211, 226),
  ('94095b9f-7e28-411c-85e2-3ca81b03fa34', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 10, 227, 264),
  ('6a24ea7a-318a-4d78-8a33-fdb22782cfb3', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 11, 265, 282),
  ('8cdc2f4b-4b16-457b-8a3a-45b70dd7e36e', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 12, 283, 316),
  ('4da2862f-6a31-4295-8431-5b5c31728a1d', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 13, 317, 334),
  ('b4358025-82c3-48d8-85a3-22e7c48f2e42', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 14, 335, 360),
  ('ba09009d-4fb6-4461-8e42-9eb1e2bcb57f', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 15, 361, 392),
  ('c6a379f7-fb86-4d74-845d-cd7b916cf540', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 16, 393, 426),
  ('309f652e-51f9-4bd7-816b-0342703497b5', 'b21b65b4-81a7-44d3-864b-d841ead654f9', 17, 427, 448);

-- konu-pekistirme-ayt-matematik
insert into public.work (id, publisher, series, subject, exam, kind) values ('2896fe22-25f2-4d1d-8570-cee4b3f9423e', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Matematik', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', '2896fe22-25f2-4d1d-8570-cee4b3f9423e', '9789751172594', null, 529, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('e2e3d11d-fbb0-4f5f-8008-52b6d6df6b92', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 1, 9, 22),
  ('0173b3e5-a2ac-4cb4-8900-ce04f6448214', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 2, 23, 66),
  ('638c97b2-c9f6-45cd-882f-3e1fe3c0794d', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 3, 67, 92),
  ('457defa0-db6c-445b-8e7a-7ed3f5b24902', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 4, 93, 108),
  ('a3f9206f-3b4b-4938-8da3-5946ce8c93ef', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 5, 109, 122),
  ('cc0dbfbf-454a-4415-8ccf-98b2e879b107', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 6, 123, 138),
  ('feb05724-2370-47be-837e-d10ccdd6ab11', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 7, 139, 154),
  ('3692a4de-0949-4758-892e-32958291242d', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 8, 155, 178),
  ('4c15cb72-fd48-4368-8f4b-abf2a4deafd2', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 9, 179, 196),
  ('25b9d9c3-62eb-49f3-8a96-4fac831513e5', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 10, 197, 224),
  ('89120667-8c8b-4f32-8df0-fb080bd352d4', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 11, 225, 246),
  ('44dd3421-3021-46c9-8899-6d2610c54038', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 12, 247, 268),
  ('737073b2-979c-44cd-8d38-8ed9befdbb5f', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 13, 269, 280),
  ('03dcb1fa-d672-486b-8541-c9df0d7bd448', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 14, 281, 298),
  ('84a873f7-c87c-436b-86b0-abffba22d093', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 15, 299, 312),
  ('8a2108a7-7765-40b0-82c0-df5fd2c4bc3b', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 16, 313, 330),
  ('995a7458-00a8-468a-82c8-195faded485a', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 17, 331, 352),
  ('d540e7a2-d1e7-4a50-8537-1282468a7f20', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 18, 353, 372),
  ('d4e382ca-ff67-4822-868c-361fafd75a44', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 19, 373, 394),
  ('d1c89fdd-8776-4700-80c2-2b65f7f1a1bc', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 20, 395, 406),
  ('b0203e39-0749-4a7b-8658-0a5188e83d73', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 21, 407, 428),
  ('65f4a514-c843-438e-898a-b066b636a71e', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 22, 429, 448),
  ('d29ddacc-9d98-4205-89c0-de958e4d68c6', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 23, 449, 470),
  ('f2df8b4c-c6ab-44fc-8734-192d033805e3', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 24, 471, 498),
  ('2488bd77-94cb-4d68-89e7-35c3053484b6', 'dba0f87b-7bf1-4a9a-8666-e5bdf022c83f', 25, 499, 522);

-- konu-pekistirme-ayt-tarih
insert into public.work (id, publisher, series, subject, exam, kind) values ('05c50447-a945-4aec-871e-12fa9213d728', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Tarih', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('9de12f26-7fac-4bc1-87e7-3f5a75f33cac', '05c50447-a945-4aec-871e-12fa9213d728', '9789751172532', null, 313, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('281d3063-1b46-4724-885a-54c2edcafab7', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 1, 9, 18),
  ('94065cb4-fa45-4389-8165-3310698bfa18', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 2, 19, 28),
  ('7a515170-6933-4f80-8bde-7f93fed256e3', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 3, 29, 40),
  ('3d38282a-3258-4b9b-8e08-7a4c3a4bd8e4', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 4, 41, 52),
  ('b15a8ea2-84a1-4d36-87e7-299d4ddba4eb', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 5, 53, 64),
  ('59af2f48-0cd1-472f-8542-71e7c49d7860', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 6, 65, 78),
  ('d697cab7-df91-49da-8203-c56352f1e09e', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 7, 79, 90),
  ('62efaf3e-22ed-42cb-88b4-30110bb662d4', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 8, 91, 102),
  ('b842928b-383e-46c4-8821-7e0cca528c77', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 9, 103, 114),
  ('0aec40c9-b2e9-4e17-8924-04d03663a24c', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 10, 115, 126),
  ('4fe046b1-7755-4c6a-82bc-1b9402da8709', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 11, 127, 140),
  ('1a2544cf-cc51-4a4a-8f9e-58831a15d01c', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 12, 141, 152),
  ('d0af8fc1-5157-4a61-851a-fb3803662502', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 13, 153, 164),
  ('67244623-16a5-4a91-8a3d-5f11c5003141', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 14, 165, 174),
  ('0c1b8f81-fdec-4bd9-8d92-3e510cee0d10', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 15, 175, 184),
  ('896d9c5c-02ae-4211-8ef1-c18137a61de4', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 16, 185, 196),
  ('d2f8fccf-b6d2-4f46-82a0-11e668845e3f', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 17, 197, 210),
  ('8f381941-d5a0-4a48-8d41-80508c93ef75', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 18, 211, 224),
  ('5ad64572-eacb-4efe-806f-94d6ef229661', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 19, 225, 234),
  ('435a826e-8cf7-4400-8475-8130271ddb8e', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 20, 235, 244),
  ('7885ab10-380c-4374-8af6-2110af1901fe', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 21, 245, 256),
  ('ddce96d2-d6e0-4dae-8fa8-71750091687a', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 22, 257, 266),
  ('38b6b712-98a2-4cf5-8972-8ffa8c4070ca', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 23, 267, 276),
  ('94950258-b0f5-4786-8acf-abed5cd81b31', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 24, 277, 286),
  ('0ea9bf86-70ad-4d1e-8f1b-e2427623c3fd', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 25, 287, 296),
  ('e90a986b-9200-4751-8853-f07842738f74', '9de12f26-7fac-4bc1-87e7-3f5a75f33cac', 26, 297, 306);

-- konu-pekistirme-ayt-tde
insert into public.work (id, publisher, series, subject, exam, kind) values ('02da440e-d4c0-4c65-824f-62b3c547d390', 'MEB OGM', 'Dört Dörtlük Konu Pekiştirme Testleri', 'Türk Dili ve Edebiyatı', 'AYT', 'soru_bankasi');
insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values ('9b6728e3-c7fa-4d57-8618-e568c7b6636a', '02da440e-d4c0-4c65-824f-62b3c547d390', '9789751172617', null, 472, 'MEB-2027', 'meb-ogm', 'draft');
insert into public.unit (id, edition_id, seq, page_start, page_end) values
  ('cab98101-85d1-4081-883e-141b2cbd1c61', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 1, 11, 28),
  ('1e07883e-0d68-47ac-8e38-5f8ff7046bb7', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 2, 29, 62),
  ('c50da399-f043-4a3b-8241-0a5e87bd0dfb', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 3, 63, 74),
  ('4bb65a7e-275c-440d-886a-da71548df5ff', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 4, 75, 96),
  ('3f1b2a46-9c03-4d94-8db7-9e1492f743c2', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 5, 97, 108),
  ('8ca97e67-e6cf-47f3-8114-649845059631', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 6, 109, 120),
  ('413a7ce7-01bf-4547-8360-804b2422b482', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 7, 121, 132),
  ('e3f7c27a-4e02-45b0-873e-2d540eb6b2e3', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 8, 133, 144),
  ('d2df3832-0402-49ba-87e9-dcf9c5ec8478', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 9, 145, 156),
  ('ecb1ddda-1086-4b7a-8533-1b1988caa2df', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 10, 157, 168),
  ('1a50e6c3-f300-4a49-82aa-c7bf2a6ad0cd', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 11, 169, 180),
  ('6428eacb-a977-4143-8b27-6dbb1a749ec0', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 12, 181, 192),
  ('aba782fd-0015-46c7-8671-48646db005bb', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 13, 193, 204),
  ('362dbf12-724a-4ad6-84ac-10455c53059b', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 14, 205, 216),
  ('92990490-5dd2-4f5d-8bb0-d85096562437', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 15, 217, 228),
  ('bd62c0bc-5d62-40f9-870a-23130c460895', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 16, 229, 252),
  ('de1dd1e2-4533-4e32-8ef2-c4b28551e19b', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 17, 253, 262),
  ('5c208b0f-1578-4e5a-8a92-3dda3a3e57ff', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 18, 263, 274),
  ('dd4f4281-1512-4c4e-8cfb-d06c4b957be6', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 19, 275, 286),
  ('1c6cb912-aa62-402c-816c-2bde58159258', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 20, 287, 296),
  ('029a01c4-7f73-46d6-8ace-a2216e9b3e3d', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 21, 297, 320),
  ('11be1286-d909-4625-8f91-e2b7006b6f74', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 22, 321, 342),
  ('755f316a-d4e0-41fb-8a3a-7d1c434d8338', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 23, 343, 354),
  ('38b71dd7-1119-42a0-8a93-abbb8a5417f1', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 24, 355, 366),
  ('6e9488b4-e65d-41c5-8387-9d2064f1e590', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 25, 367, 378),
  ('4d8264e9-733b-4c56-8747-2168859e93cd', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 26, 379, 390),
  ('4544cdc4-0e6f-4ae5-8dcb-3393a7f71c22', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 27, 391, 402),
  ('31a2c76c-b793-4318-8114-4f7eaebeaa38', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 28, 403, 414),
  ('40776dda-591d-4e1d-8c77-6f81b58f24f2', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 29, 415, 452),
  ('ddc10b3b-b505-4d5b-84bd-373c0d446201', '9b6728e3-c7fa-4d57-8618-e568c7b6636a', 30, 453, 464);
