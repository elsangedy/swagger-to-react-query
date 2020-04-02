module.exports = {
  apis: [
    {
      name: 'Nestjs Example API',
      url: 'https://nestjs-example.now.sh/json',
      output: {
        path: 'generated',
        file: 'example'
      },
      kyOptions: {
        prefixUrl: 'https://nestjs-example.now.sh'
      }
    }
  ]
}
