INSERT INTO users (
    username,
    email,
    name,
    phone_number,
    password,
    created_at,
    updated_at,
    role,
    status,
    shop_id
)
VALUES (
    'admin',
    NULL,
    'Phùng Văn Hưng',
    '0383906221',
    '$2a$10$NYJYPrMnHEaXQSOyIaHHaOwbXHzy/kpoQUcupCAk5AwxQPQlQ5Jhu',
    '2025-02-20 21:22:13.295285',
    '2025-02-21 03:45:58.604365',
    'ADMIN',
    'ACTIVE',
    NULL
);


INSERT INTO categories (
    name,
    description,
    image_url,
    created_at,
    updated_at
)
VALUES
    (N'Gạo ST25',
     N'Gạo ngon nhất thế giới, từng đạt giải quốc tế',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Nàng Thơm Chợ Đào',
     N'Hương thơm đặc trưng, hạt cơm dẻo và mềm',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Tám Xoan Hải Hậu',
     N'Hạt gạo nhỏ, trắng, thơm nhẹ, đặc sản Hải Hậu',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Séng Cù',
     N'Đặc sản vùng Tây Bắc, hạt to, thơm và đậm đà',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Điện Biên',
     N'Hương vị đậm đà, dẻo, thơm, đặc sản vùng núi',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Lứt Huyết Rồng',
     N'Gạo lứt giàu dinh dưỡng, hạt màu nâu đỏ đậm',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Nếp Cẩm',
     N'Dùng để nấu xôi, chè; hạt tím đậm, giàu chất xơ',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Nếp Cái Hoa Vàng',
     N'Nấu xôi thơm dẻo, hạt gạo tròn, trắng đục',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Japonica',
     N'Hạt tròn, dẻo, thường dùng để nấu cơm kiểu Nhật',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Koshihikari',
     N'Hạt ngắn, mềm, ngọt, rất phổ biến tại Nhật Bản',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Tài Nguyên',
     N'Cơm khô, tơi, thường dùng cho các món chiên, rang',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Jasmine',
     N'Hạt dài, thơm nhẹ, mềm và dẻo khi nấu',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Hương Lài',
     N'Hạt trắng, thơm tự nhiên, vị ngọt dịu',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Basmati',
     N'Hạt dài, tơi, thường dùng cho ẩm thực Ấn Độ',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Hạt Ngọc Trời',
     N'Thương hiệu gạo cao cấp, hạt đều và thơm',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Hương Quê',
     N'Hạt dẻo thơm, thường dùng trong gia đình Việt',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Nếp Nương',
     N'Đặc sản vùng Tây Bắc, dẻo, thơm, nấu xôi rất ngon',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Nàng Xuân',
     N'Cơm trắng dẻo, vị ngọt nhẹ, phù hợp bữa ăn hằng ngày',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo Thái Hom Mali',
     N'Gạo thơm của Thái Lan, hạt dài, mềm dẻo',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE()),
    (N'Gạo ST24',
     N'Tiền thân của ST25, hạt dài, cơm dẻo, thơm dịu',
     'https://gaoducthinh.vn/wp-content/uploads/2023/04/thom7m-49-scaled.jpg',
     GETDATE(),
     GETDATE());

     INSERT INTO users ( created_at, email, name, password, phone_number, role, status, updated_at, username, shop_id)
VALUES 
('2025-03-20 16:29:39.641397', 'danganh123@gmail.com', 'Dương Đăng Anh', 
 '$2a$10$1xvaX9NoCkqoTiVoBW.gh.JkfKPtG6VUhmwJG6s8VVazJpibszjTK', 
 '09123123183', 'OWNER', 'ACTIVE', '2025-03-20 16:29:39.693146', 'danganh', null);

 INSERT INTO shops (address, created_at,  name, updated_at, create_by)
VALUES 
('Việt Nam',  '2025-03-20 16:29:39.678121','Cửa hàng của Dương Đăng Anh', '2025-03-20 16:29:39.678121', 
	(select  id from users where username = 'danganh')
);

update users set shop_id = (select id from shops where create_by = ((select  id from users where username = 'danganh')) )
where id = (select  id from users where username = 'danganh')



   INSERT INTO partners (name, contact_name, phone, email, address, website, description, shop_id, created_at, can_have_debt)
VALUES 
(N'Công Ty TNHH An Phát', N'Nguyễn Văn An', N'0901234567', N'an.nguyen@anphat.vn', N'123 Đường Lê Lợi, Quận 1, TP.HCM', N'http://www.anphat.vn', N'Nhà cung cấp thiết bị văn phòng.',
    (SELECT id FROM shops WHERE create_by = (SELECT id FROM users WHERE username = 'danganh')), GETDATE(), 0),
(N'Công Ty CP Bình Minh', N'Trần Thị Bình', N'0912345678', N'binh.tran@binhminh.vn', N'456 Đường Trần Hưng Đạo, Hà Nội', N'http://www.binhminh.vn', N'Chuyên phân phối linh kiện điện tử.',
    (SELECT id FROM shops WHERE create_by = (SELECT id FROM users WHERE username = 'danganh')), GETDATE(), 0),
(N'Công Ty TNHH Cường Thịnh', N'Lê Văn Cường', N'0923456789', N'cuong.le@cuongthinh.vn', N'789 Đường Phạm Văn Đồng, Hải Phòng', N'http://www.cuongthinh.vn', N'Nhà cung cấp vật liệu xây dựng.',
    (SELECT id FROM shops WHERE create_by = (SELECT id FROM users WHERE username = 'danganh')), GETDATE(), 0),
(N'Công Ty CP Duy Tân', N'Phạm Thị Duyên', N'0934567890', N'duyen.pham@duytan.vn', N'321 Đường Hai Bà Trưng, Đà Nẵng', N'http://www.duytan.vn', N'Chuyên cung cấp giải pháp CNTT.',
    (SELECT id FROM shops WHERE create_by = (SELECT id FROM users WHERE username = 'danganh')), GETDATE(), 0),
(N'Công Ty TNHH Ecoline', N'Vũ Minh E', N'0945678901', N'minh.vu@ecoline.vn', N'654 Đường Nguyễn Trãi, Quận 5, TP.HCM', N'http://www.ecoline.vn', N'Nhà cung cấp sản phẩm xanh và bền vững.',
    (SELECT id FROM shops WHERE create_by = (SELECT id FROM users WHERE username = 'danganh')), GETDATE(), 0),
(N'Công Ty CP Vina Trade', N'Trần Vina', N'0990011223', N'vina.tran@vinatrade.vn', N'203 Đường Phan Đình Phùng, TP.HCM', N'http://www.vinatrade.vn', N'Chuyên cung cấp giải pháp thương mại.',
    (SELECT id FROM shops WHERE create_by = (SELECT id FROM users WHERE username = 'danganh')), GETDATE(), 0);


    DECLARE @price DECIMAL(10,2);
DECLARE @i INT = 1;

WHILE @i <= 10
BEGIN
    SET @price = 10000 + (15000 - 10000) * RAND();

    INSERT INTO dbo.products 
        (name, description, price, created_at, category_id, shop_id, partner_id)
    VALUES 
        (N'Gạo nếp ' + CAST(@i AS NVARCHAR(10)),  -- Tên sản phẩm (thêm số để phân biệt)
         N'Một gói gạo nếp chất lượng ' + CAST(@i AS NVARCHAR(10)),  -- Mô tả sản phẩm (thêm số để phân biệt)
         @price,  -- Giá ngẫu nhiên từ 10000 đến 15000
         GETDATE(),  -- Thời gian tạo sản phẩm
         1,  -- category_id là 1
         (SELECT id FROM dbo.shops WHERE create_by = (SELECT id FROM dbo.users WHERE username = 'danganh')),  -- Shop của user 'danganh'
         NULL);  -- Partner ID có thể là NULL nếu không có đối tác

    SET @i = @i + 1;
END

DECLARE @image_url NVARCHAR(255) = N'https://thitngonnhapkhau.vn/wp-content/uploads/2022/12/thanh-phan-dinh-duong-gao-st25.png';  -- Đường dẫn ảnh thực tế
DECLARE @ii INT = 1;

WHILE @ii <= 10
BEGIN
    INSERT INTO dbo.product_image_urls 
        (product_id, image_url)
    VALUES 
        ((SELECT id FROM dbo.products WHERE name = N'Gạo nếp ' + CAST(@ii AS NVARCHAR(10))),  -- Lấy ID của sản phẩm "Gạo nếp X"
         @image_url);  -- Đường dẫn đến ảnh thực tế

    SET @ii = @ii + 1;
END







