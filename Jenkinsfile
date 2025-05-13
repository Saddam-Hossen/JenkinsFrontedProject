pipeline {
  agent any

  environment {
    // Use forward slashes for Windows compatibility
    SSH_KEY_PATH = "${WORKSPACE}\\key.pem"
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
          CI=false npm run build
        '''
      }
      post {
        success {
          archiveArtifacts artifacts: 'build/**', fingerprint: true
        }
      }
    }

    stage('Prepare SSH') {
      steps {
        script {
          // Write the SSH key file
          writeFile file: env.SSH_KEY_PATH, text: env.DO_SSH_KEY
          
          // Set proper permissions (may not work perfectly on Windows)
          bat """
            icacls "${env.SSH_KEY_PATH}" /inheritance:r
            icacls "${env.SSH_KEY_PATH}" /grant:r "%USERNAME%":(R)
            icacls "${env.SSH_KEY_PATH}" /grant:r "SYSTEM":(R)
          """
          
          // Add host to known_hosts
          bat """
            mkdir "%USERPROFILE%\\.ssh" 2>nul
            ssh-keyscan -H ${env.DO_HOST} >> "%USERPROFILE%\\.ssh\\known_hosts"
          """
        }
      }
    }

    stage('Deploy to DigitalOcean') {
      steps {
        script {
          try {
            // Kill existing process
            bat """
              plink -i "${env.SSH_KEY_PATH}" -batch -ssh ${env.DO_USER}@${env.DO_HOST} "
                PID=\$(lsof -t -i:${env.PORT} || echo \"\")
                if [ -n \"\$PID\" ]; then
                  kill -9 \$PID
                  echo ✅ Process on port ${env.PORT} killed.
                else
                  echo ⚠️ No process found on port ${env.PORT}.
                fi
                cd ${env.REMOTE_DIR}
                rm -rf build.bak 2>/dev/null
                mv build build.bak 2>/dev/null || echo No previous build to back up
              "
            """
            
            // Upload new build
            bat """
              pscp -i "${env.SSH_KEY_PATH}" -r build ${env.DO_USER}@${env.DO_HOST}:${env.REMOTE_DIR}/
            """
            
            // Start new server
            bat """
              plink -i "${env.SSH_KEY_PATH}" -batch -ssh ${env.DO_USER}@${env.DO_HOST} "
                cd ${env.REMOTE_DIR}/build
                nohup npx serve -s . -l ${env.PORT} > serve.log 2>&1 &
                echo ✅ React app started on port ${env.PORT}.
              "
            """
          } catch (err) {
            // Rollback if deployment fails
            bat """
              plink -i "${env.SSH_KEY_PATH}" -batch -ssh ${env.DO_USER}@${env.DO_HOST} "
                cd ${env.REMOTE_DIR}
                if [ ! -d build ]; then
                  echo ❌ Deployment failed. Rolling back...
                  mv build.bak build
                  echo 🔁 Rollback complete.
                fi
              "
            """
            error("Deployment failed: ${err.message}")
          }
        }
      }
    }
  }
}