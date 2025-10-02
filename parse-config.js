// Parse Server configuration
module.exports = {
  appId: 'WVPClNsBDJiG2ZdyIi9tOrKdgpPTpWbXs3jojIII',
  masterKey: 'l4YNC3ErDQN2OWrwrI237bCQrY7DclJU3SLO7loa',
  serverURL: 'https://parseapi.back4app.com',
  databaseURI: 'mongodb://localhost:27017/school_db',
  cloud: './cloud/main.js',
  appName: 'school student data',
  publicServerURL: 'https://parseapi.back4app.com',
  allowClientClassCreation: false,
  enableAnonymousUsers: false,
  filesAdapter: {
    module: '@parse/fs-files-adapter',
    options: {
      filesSubDirectory: './files'
    }
  }
};