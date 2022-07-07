const sequelize = require('../config/connection');
const postData = require('./postData');

const seedAll = async () => {
    await sequelize.sync({ force: true });
  
    await postData();
  
    process.exit(0);
  };
  
  seedAll();
  