const User = require('../services/UsersService'); // Assuming you have a User model

const initManager = async () => {
  const managerEmail = process.env.MANAGER_EMAIL;
  const managerPassword = process.env.MANAGER_PASSWORD;

  try {
    // Check if the manager already exists
    let manager = await User.findUserByEmailAddress(managerEmail);

    if (!manager) {
      // If the manager doesn't exist, create a new one
      //const hashedPassword = await bcrypt.hash(managerPassword, 10);
      manager = {
        Email: managerEmail,
        Password: managerPassword,
        Phone: process.env.MANAGER_PHONE,
        Name: process.env.MANAGER_NAME,
        RoleID: 1,
      };
      await User.createUser(manager);
      console.log('Manager user created successfully.');
    } else {
      console.log('Manager user already exists.');
    }
  } catch (error) {
    console.error('Error initializing manager:', error);
  }
};

module.exports = initManager;