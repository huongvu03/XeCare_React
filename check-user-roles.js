async function checkUserRoles() {
  try {
    // Login first
    const loginResponse = await fetch('http://localhost:8080/apis/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user2@gmail.com',
        password: 'password'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed:', await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log('Login successful');
    console.log('User role:', loginData.role);
    console.log('Token:', loginData.token ? 'Present' : 'Missing');

    // Get user profile
    const profileResponse = await fetch('http://localhost:8080/apis/user/profile', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!profileResponse.ok) {
      console.log('Profile fetch failed:', await profileResponse.text());
      return;
    }

    const profileData = await profileResponse.json();
    console.log('\nUser Profile:');
    console.log('Role:', profileData.role);
    console.log('Name:', profileData.name);
    console.log('Email:', profileData.email);
    console.log('Garages:', profileData.garages ? profileData.garages.length : 0);

    // Check dual role APIs
    const dualRoleResponse = await fetch('http://localhost:8080/apis/user/roles/dual-role');
    if (dualRoleResponse.ok) {
      const dualRoleData = await dualRoleResponse.json();
      console.log('\nDual Role Users:', dualRoleData.length);
    }

    const canBookResponse = await fetch('http://localhost:8080/apis/user/roles/can-book');
    if (canBookResponse.ok) {
      const canBookData = await canBookResponse.json();
      console.log('Users who can book:', canBookData.length);
    }

    const canManageGaragesResponse = await fetch('http://localhost:8080/apis/user/roles/can-manage-garages');
    if (canManageGaragesResponse.ok) {
      const canManageGaragesData = await canManageGaragesResponse.json();
      console.log('Users who can manage garages:', canManageGaragesData.length);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUserRoles();
