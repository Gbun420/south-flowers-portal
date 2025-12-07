-- Database function for atomic order creation
CREATE OR REPLACE FUNCTION create_order_transaction(
    p_user_id UUID,
    p_strain_id UUID,
    p_quantity_grams INTEGER
)
RETURNS VOID AS $$
DECLARE
    current_stock INTEGER;
    current_limit INTEGER;
BEGIN
    -- Get current stock and lock the strain row
    SELECT stock_grams INTO current_stock
    FROM strains
    WHERE id = p_strain_id
    FOR UPDATE;

    -- Check if enough stock is available
    IF current_stock < p_quantity_grams THEN
        RAISE EXCEPTION 'Insufficient stock: only %g available', current_stock;
    END IF;

    -- Get current user limit and lock the profile row
    SELECT monthly_limit_remaining INTO current_limit
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- Check if user has enough monthly limit
    IF current_limit < p_quantity_grams THEN
        RAISE EXCEPTION 'Insufficient monthly limit: only %g remaining', current_limit;
    END IF;

    -- Create the order
    INSERT INTO orders (user_id, strain_id, quantity_grams, status, created_at)
    VALUES (p_user_id, p_strain_id, p_quantity_grams, 'pending', NOW());

    -- Update strain stock
    UPDATE strains
    SET stock_grams = stock_grams - p_quantity_grams
    WHERE id = p_strain_id;

    -- Update user monthly limit
    UPDATE profiles
    SET monthly_limit_remaining = monthly_limit_remaining - p_quantity_grams
    WHERE id = p_user_id;

END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_order_transaction TO authenticated;