module.exports = {
  apis: [
    {
      name: 'Nestjs Example API',
      input: {
        url: 'https://nestjs-example.now.sh/json',
      },
      output: {
        path: 'generated',
        file: 'example',
      },
      kyOptions: {
        prefixUrl: 'https://nestjs-example.now.sh',
        throwHttpErrors: false,
      },
    },
    {
      name: 'PIX',
      input: {
        json: require('./openapi.json'),
      },
      output: {
        path: 'generated',
        file: 'pix',
      },
      kyOptions: {
        prefixUrl: 'https://pix.com',
        throwHttpErrors: false,
        retry: {
          statusCodes: [401],
        },
      },
    },
  ],
}
