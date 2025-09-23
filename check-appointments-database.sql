-- Check appointments for garage 11
SELECT 
    a.id,
    a.customer_name,
    a.customer_phone,
    a.customer_email,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.notes,
    a.garage_id,
    a.user_id,
    a.created_at,
    a.updated_at
FROM appointments a
WHERE a.garage_id = 11
ORDER BY a.created_at DESC;

-- Check appointments count by status for garage 11
SELECT 
    status,
    COUNT(*) as count
FROM appointments
WHERE garage_id = 11
GROUP BY status;

-- Check all appointments in database
SELECT 
    a.id,
    a.customer_name,
    a.garage_id,
    a.status,
    a.appointment_date,
    a.created_at
FROM appointments a
ORDER BY a.created_at DESC
LIMIT 20;

-- Check if there are any appointments at all
SELECT COUNT(*) as total_appointments FROM appointments;

-- Check appointments by garage
SELECT 
    garage_id,
    COUNT(*) as appointment_count,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'CONFIRMED' THEN 1 END) as confirmed_count,
    COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_count,
    COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_count
FROM appointments
GROUP BY garage_id
ORDER BY appointment_count DESC;