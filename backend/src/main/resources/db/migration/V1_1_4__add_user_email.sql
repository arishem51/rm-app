IF NOT EXISTS (
    SELECT 1 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'email'
)
BEGIN
    ALTER TABLE users 
    ADD email NVARCHAR(255)  NULL ;
END
