const mysql = require('mysql2/promise');

async function checkEmergencyData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'xecare2'
  });

  try {
    console.log('🔍 Checking Emergency Data in Database...\n');

    // Check Emergency_Requests table
    console.log('1️⃣ Checking Emergency_Requests table:');
    const [requests] = await connection.execute('SELECT * FROM Emergency_Requests ORDER BY created_at DESC LIMIT 5');
    console.log(`Found ${requests.length} emergency requests:`);
    requests.forEach((req, index) => {
      console.log(`  ${index + 1}. ID: ${req.id}, Status: ${req.status}, User: ${req.user_id}, Description: ${req.description}`);
    });

    // Check Emergency_Quotes table
    console.log('\n2️⃣ Checking Emergency_Quotes table:');
    const [quotes] = await connection.execute('SELECT * FROM Emergency_Quotes ORDER BY created_at DESC LIMIT 5');
    console.log(`Found ${quotes.length} emergency quotes:`);
    quotes.forEach((quote, index) => {
      console.log(`  ${index + 1}. ID: ${quote.id}, Request: ${quote.emergency_request_id}, Price: ${quote.price}, Accepted: ${quote.accepted}`);
    });

    // Check Users with GARAGE role
    console.log('\n3️⃣ Checking Users with GARAGE role:');
    const [garageUsers] = await connection.execute('SELECT id, name, email, account_type FROM users WHERE account_type = "GARAGE"');
    console.log(`Found ${garageUsers.length} garage users:`);
    garageUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });

    // Check Garages
    console.log('\n4️⃣ Checking Garages:');
    const [garages] = await connection.execute('SELECT id, name, user_id, status FROM garages LIMIT 5');
    console.log(`Found ${garages.length} garages:`);
    garages.forEach((garage, index) => {
      console.log(`  ${index + 1}. ID: ${garage.id}, Name: ${garage.name}, User: ${garage.user_id}, Status: ${garage.status}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await connection.end();
  }
}

checkEmergencyData();
