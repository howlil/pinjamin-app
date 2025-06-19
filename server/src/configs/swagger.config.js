const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

// Read YAML file
const swaggerYamlPath = path.join(__dirname, '../swagger.yml');
const swaggerYaml = fs.readFileSync(swaggerYamlPath, 'utf8');
const specs = yaml.load(swaggerYaml);

// Set dynamic server URL
if (process.env.NODE_ENV === 'production') {
    specs.servers = [
        {
            url: process.env.BASE_URL || 'https://your-production-url.com',
            description: 'Production server'
        }
    ];
} else {
    specs.servers = [
        {
            url: process.env.BASE_URL || 'http://localhost:8080',
            description: 'Development server'
        }
    ];
}

const swaggerOptions = {
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info hgroup.main a { color: #3b82f6; }
  `,
    customSiteTitle: 'Building Rental API Documentation',
    customfavIcon: '/favicon.ico'
};

module.exports = {
    specs,
    swaggerUi,
    swaggerOptions
}; 