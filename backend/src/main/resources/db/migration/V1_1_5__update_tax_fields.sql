IF EXISTS (
    SELECT * FROM sys.columns 
    WHERE Name = N'tax_id' 
      AND Object_ID = Object_ID(N'suppliers')
)
BEGIN
    ALTER TABLE suppliers DROP COLUMN tax_id;
END

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE Name = N'tax_code' 
      AND Object_ID = Object_ID(N'suppliers')
)
BEGIN
    ALTER TABLE suppliers ADD tax_code NVARCHAR(255) NOT NULL;
END

IF EXISTS (
    SELECT * FROM sys.columns 
    WHERE Name = N'notes' 
      AND Object_ID = Object_ID(N'suppliers')
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = N'description' 
          AND Object_ID = Object_ID(N'suppliers')
    )
    BEGIN
        EXEC sp_rename 'suppliers.notes', 'description', 'COLUMN';
        ALTER TABLE suppliers ALTER COLUMN description NVARCHAR(255);
    END
END
ELSE
BEGIN
    IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = N'description' 
          AND Object_ID = Object_ID(N'suppliers')
    )
    BEGIN
        ALTER TABLE suppliers ADD description NVARCHAR(255);
    END
    ELSE
    BEGIN
        ALTER TABLE suppliers ALTER COLUMN description NVARCHAR(255);
    END
END
