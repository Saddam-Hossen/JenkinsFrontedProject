pipeline {
  agent any

  environment {
    SSH_KEY_PATH = "${WORKSPACE}/key.pem"
    REMOTE_DIR = '/www/wwwroot/CITSNVN/itcrashcourse'
    PORT = '3084'
    DO_SSH_KEY = credentials('DO_SSH_KEY')
    DO_USER = credentials('DO_USER')
    DO_HOST = credentials('DO_HOST')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Saddam-Hossen/JenkinsFrontedProject'
      }
    }

    stage('Install Dependencies') {
      steps {
        bat '''
          npm ci
          npm run lint || echo "ESLint completed with warnings"
          set CI=false
          npm run build
        '''
      }
      post {
        success {
          archiveArtifacts artifacts: 'build/**', fingerprint: true
        }
      }
    }

    stage('Prepare SSH Key') {
      steps {
        script {
          writeFile file: env.SSH_KEY_PATH, text: env.DO_SSH_KEY

          // Set appropriate permissions on the SSH key
          bat """
            icacls "${env.SSH_KEY_PATH}" /inheritance:r
            icacls "${env.SSH_KEY_PATH}" /grant:r "%USERNAME%":(R)
            icacls "${env.SSH_KEY_PATH}" /grant:r "SYSTEM":(R)
          """
        }
      }
    }

    stage('Deploy to DigitalOcean') {
      steps {
        script {
          try {
            // Kill existing process & backup previous build
            bat """
              ssh -i "${env.SSH_KEY_PATH}" -o StrictHostKeyChecking=no ${env.DO_USER}@${env.DO_HOST} ^
              "PID=\\$(lsof -t -i:${env.PORT} || echo '') && ^
              if [ ! -z \\"\\$PID\\" ]; then kill -9 \\$PID; fi && ^
              cd ${env.REMOTE_DIR} && rm -rf build.bak && mv build build.bak || echo No previous build"
            """

            // Upload new build using SCP
            bat """
              scp -i "${env.SSH_KEY_PATH}" -r build ${env.DO_USER}@${env.DO_HOST}:${env.REMOTE_DIR}/
            """

            // Start the React app on remote server
            bat """
              ssh -i "${env.SSH_KEY_PATH}" -o StrictHostKeyChecking=no ${env.DO_USER}@${env.DO_HOST} ^
              "cd ${env.REMOTE_DIR}/build && nohup npx serve -s . -l ${env.PORT} > serve.log 2>&1 &"
            """
          } catch (err) {
            // Rollback if deployment fails
            bat """
              ssh -i "${env.SSH_KEY_PATH}" -o StrictHostKeyChecking=no ${env.DO_USER}@${env.DO_HOST} ^
              "cd ${env.REMOTE_DIR} && if [ ! -d build ]; then echo Rolling back... && mv build.bak build; fi"
            """
            error("Deployment failed: ${err.message}")
          }
        }
      }
    }
  }
}
