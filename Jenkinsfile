pipeline {
  agent any

  environment {
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
          
          // Set proper permissions using PowerShell (more reliable on Windows)
          bat """
            powershell -command "icacls '${env.SSH_KEY_PATH}' /reset"
            powershell -command "icacls '${env.SSH_KEY_PATH}' /grant:r '%USERNAME%':(R)"
            powershell -command "icacls '${env.SSH_KEY_PATH}' /grant:r 'SYSTEM':(R)"
            powershell -command "icacls '${env.SSH_KEY_PATH}' /inheritance:r"
          """
          
          // Create SSH directory in user profile (not system profile)
          bat """
            if not exist "%USERPROFILE%\\.ssh" mkdir "%USERPROFILE%\\.ssh"
          """
          
          // Add host to known_hosts with compatible KEX algorithms
          bat """
            ssh-keyscan -H ${env.DO_HOST} >> "%USERPROFILE%\\.ssh\\known_hosts"
          """
        }
      }
    }

    stage('Deploy to DigitalOcean') {
      steps {
        script {
          try {
            // First test SSH connection
            bat """
              plink -batch -ssh -i "${env.SSH_KEY_PATH}" ${env.DO_USER}@${env.DO_HOST} "echo SSH Connection Test Successful"
            """
            
            // Kill existing process
            bat """
              plink -batch -ssh -i "${env.SSH_KEY_PATH}" ${env.DO_USER}@${env.DO_HOST} "
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
              pscp -batch -i "${env.SSH_KEY_PATH}" -r build ${env.DO_USER}@${env.DO_HOST}:${env.REMOTE_DIR}/
            """
            
            // Start new server
            bat """
              plink -batch -ssh -i "${env.SSH_KEY_PATH}" ${env.DO_USER}@${env.DO_HOST} "
                cd ${env.REMOTE_DIR}/build
                nohup npx serve -s . -l ${env.PORT} > serve.log 2>&1 &
                echo ✅ React app started on port ${env.PORT}.
              "
            """
          } catch (err) {
            // Rollback if deployment fails
            bat """
              plink -batch -ssh -i "${env.SSH_KEY_PATH}" ${env.DO_USER}@${env.DO_HOST} "
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