const main = ({
    integer,
    string,
    float
  }) => {
    const serverPort = integer('SERVER_PORT', 3000)
    const appConfigEnv = process.env.APP_CONFIG_ENV || 'development'
    const appDomain = string('APP_DOMAIN')
    const namespace = (process.env.CI_PROJECT_NAME || 'todo-chatgptapp').toLowerCase().replace(/\./g, '-')
    const SERVER = 0
    
    const config = {
      applications: [{
        buildEnv: [
          'APP_ENV'
        ],
        container: {
          imagePullPolicy: 'Always',
        },
        env: {
          ENV: appConfigEnv,
        },
        // secureEnv: [
        //   'PGSQL_DB_USER',
        //   'PGSQL_DB_PASSWORD',
        //   'AES_ENC_KEY',
        //   'APOS_MONGODB_URI',
        //   'FORGEROCK_BASE_URL',
        //   'FORGEROCK_ISSUER_URI',
        //   'FORGEROCK_AUDIENCE',
        //   'FORGEROCK_CLIENT_ID',
        //   'FORGEROCK_CLIENT_SECRET',
        //   'SALESFORCE_BASE_URL',
        //   'SALESFORCE_ISSUER_URI',
        //   'SALESFORCE_AUDIENCE',
        //   'SALESFORCE_CLIENT_ID',
        //   'SALESFORCE_CLIENT_SECRET',
        //   'SALESFORCE_USERNAME',
        //   'SALESFORCE_PASSWORD',
        //   'SALESFORCE_API_KEY',
        //   'SALESFORCE_TOKEN_URL',
        //   'SALESFORCE_UPDATE_URL',
        //   'SALESFORCE_DISABLE_USER_URL',
        //   'SALESFORCE_CONSENT_URL',
        //   'UPS_BASE_URI',
        //   'UPS_USERNAME',
        //   'UPS_PASSWORD',
        //   'BREVO_API_KEY',
        //   'BO_ADMIN_USERNAME',
        //   'BO_ADMIN_PASSWORD',
        //   'BO_CLIENT_USERNAME',
        //   'BO_CLIENT_PASSWORD'
        // ],
        hosts: [appDomain],
        healthcheck: {
          path: '/',
        },
        kind: 'server',
        server: {
          instances: integer('INSTANCES', 1),
          port: serverPort,
        },
        service: true,
        securityContext: {
          runAsUser: 0,
          runAsNonRoot: false,
          allowPrivilegeEscalation: true,
        },
        ingress: {
          class: string('AKS_INGRESS_CLASS'),
          sessionAffiity: true,
        },
      }],
      namespace,
    }
  
    if (appConfigEnv === 'production') {
      config.applications[SERVER].hosts = [
        process.env.DOMAIN_PRODUCTION || 'replace.your.prod.domain',
      ]
    }
    
    return config
  
  }
  
  module.exports = main


