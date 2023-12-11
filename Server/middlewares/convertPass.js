const bcrypt = require('bcryptjs');

async function hashPassword() {
  const passwd = '123';
  const hashedPassword = await bcrypt.hash(passwd, 10);
  
  console.log('Hashed password:', hashedPassword);
}

hashPassword();