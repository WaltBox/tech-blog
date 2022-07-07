const { Post } = require('../models');

const postdb = [
  {
    title: 'Printemps',
    body:'dvdvdv'
  },
  {
    title: 'Sommer',
    body:'dvdvdv'
  },
  {
    title: 'Herfst',
    body:'dvdvdv'
  },
  {
    title: 'Invierno',
    body:'dvdvdv'
  },
];

const postData = () => Post.bulkCreate(postdb);

module.exports = postData;