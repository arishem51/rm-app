-- Check if 'created_at' column exists before adding it
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'shops' AND COLUMN_NAME = 'created_at'
)
BEGIN
    ALTER TABLE shops ADD created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();
END;
GO

-- Check if 'updated_at' column exists before adding it
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'shops' AND COLUMN_NAME = 'updated_at'
)
BEGIN
    ALTER TABLE shops ADD updated_at DATETIME2 NULL;
END;
GO

-- Check if trigger already exists before creating it (using dynamic SQL)
IF NOT EXISTS (
    SELECT 1 FROM sys.triggers WHERE name = 'trg_update_shops_timestamp'
)
BEGIN
    EXEC('
    CREATE TRIGGER trg_update_shops_timestamp
    ON shops
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE shops
        SET updated_at = SYSUTCDATETIME()
        FROM shops
        INNER JOIN inserted ON shops.id = inserted.id;
    END;')
END;
GO
