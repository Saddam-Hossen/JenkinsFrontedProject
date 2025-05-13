pipeline {
  agent any

  environment {
    SSH_KEY_DIR = "${WORKSPACE}\\ssh_keys"
    SSH_KEY_PATH = "${SSH_KEY_DIR}\\key.pem"
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
          // Create key directory
          bat """
            if not exist "${SSH_KEY_DIR}" mkdir "${SSH_KEY_DIR}"
          """

          // Save the SSH private key
          writeFile file: "${env.SSH_KEY_PATH}", text: "${env.DO_SSH_KEY}"

          // Set file permissions (OpenSSH requires limited access)
          bat """
            icacls "${SSH_KEY_PATH}" /inheritance:r
            icacls "${SSH_KEY_PATH}" /grant:r "%USERNAME%":(R)
            icacls "${SSH_KEY_PATH}" /grant:r "SYSTEM":(R)
          """

          // Add host to known_hosts
          bat """
            if not exist "%USERPROFILE%\\.ssh" mkdir "%USERPROFILE%\\.ssh"
            ssh-keyscan -H %DO_HOST% >> "%USERPROFILE%\\.ssh\\known_hosts"
          """
        }
      }
    }

    stage('Deploy to DigitalOcean') {
      steps {
        script {
          try {
            // Test SSH connection
            bat """
              ssh -i "${SSH_KEY_PATH}" -o StrictHostKeyChecking=no %DO_USER%@%DO_HOST% "echo ✅ SSH connected."
            """

            // Kill existing process and backup old build
            bat """
              ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "
                PID=\\$(lsof -t -i:%PORT% || echo \"\")
                if [ -n \\\"\\$PID\\\" ]; then
                  kill -9 \\$PID
                  echo ✅ Process on port %PORT% killed.
                else
                  echo ⚠️ No process found on port %PORT%.
                fi
                cd %REMOTE_DIR%
                rm -rf build.bak 2>/dev/null
                mv build build.bak 2>/dev/null || echo No previous build to back up
              "
            """

            // Upload new build using SCP
            bat """
              scp -i "${SSH_KEY_PATH}" -r build %DO_USER%@%DO_HOST%:%REMOTE_DIR%/
            """

            // Start React app
            bat """
              ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "
                cd %REMOTE_DIR%/build
                nohup npx serve -s . -l %PORT% > serve.log 2>&1 &
                echo ✅ React app started on port %PORT%.
              "
            """
          } catch (err) {
            // Rollback on failure
            bat """
              ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "
                cd %REMOTE_DIR%
                if [ ! -d build ]; then
                  echo ❌ Deployment failed. Rolling back...
                  mv build.bak build
                  echo 🔁 Rollback complete.
                fi
              "
            """
            error("🚨 Deployment failed: ${err.message}")
          }
        }
      }
    }
  }
}
