-- Add shop_id column to users table
ALTER TABLE dbo.users ADD shop_id BIGINT;

-- Add foreign key constraint (users → shops)
ALTER TABLE dbo.users 
ADD CONSTRAINT fk_users_shop 
FOREIGN KEY (shop_id) REFERENCES dbo.shops(id) 
ON DELETE CASCADE;
