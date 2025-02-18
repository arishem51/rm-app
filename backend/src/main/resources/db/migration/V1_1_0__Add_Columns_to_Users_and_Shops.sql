-- Check if column 'shop_id' exists before adding it
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'shop_id'
)
BEGIN
    -- Add shop_id column to users table
    ALTER TABLE dbo.users ADD shop_id BIGINT;
END;
GO

-- Ensure foreign key constraint is added only if it does not exist
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_NAME = 'users' AND CONSTRAINT_NAME = 'fk_users_shop'
)
BEGIN
    -- Add foreign key constraint (users → shops)
    ALTER TABLE dbo.users 
    ADD CONSTRAINT fk_users_shop 
    FOREIGN KEY (shop_id) REFERENCES dbo.shops(id) 
    ON DELETE CASCADE;
END;
GO
