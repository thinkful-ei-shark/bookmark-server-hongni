const { v4: uuid } = require('uuid');

const bookmarks = [{
  id: uuid(),
  title: 'Google',
  url: 'http://www.google.com',
  rating: 5,
  description: 'Something'
}]

module.exports = bookmarks;