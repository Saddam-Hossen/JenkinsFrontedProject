pipeline {
  agent any

  environment {
    // Use a temp directory that Jenkins can definitely write to
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
          // Create a dedicated directory for SSH keys
          bat """
            if not exist "${SSH_KEY_DIR}" mkdir "${SSH_KEY_DIR}"
          """
          
          // Write the SSH key file with proper permissions
          bat """
            echo Writing SSH key...
            echo %DO_SSH_KEY% > "${SSH_KEY_PATH}"
            
            echo Setting permissions...
            icacls "${SSH_KEY_PATH}" /inheritance:r
            icacls "${SSH_KEY_PATH}" /grant:r "%USERNAME%":(F)
            icacls "${SSH_KEY_PATH}" /grant:r "SYSTEM":(F)
            
            echo Verifying permissions...
            icacls "${SSH_KEY_PATH}"
          """
          
          // Add host to known_hosts in user profile
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
            // Test SSH connection first
            bat """
              plink -batch -ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "echo SSH connection successful"
            """
            
            // Kill existing process
            bat """
              plink -batch -ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "
                PID=\$(lsof -t -i:%PORT% || echo \"\")
                if [ -n \"\$PID\" ]; then
                  kill -9 \$PID
                  echo ✅ Process on port %PORT% killed.
                else
                  echo ⚠️ No process found on port %PORT%.
                fi
                cd %REMOTE_DIR%
                rm -rf build.bak 2>/dev/null
                mv build build.bak 2>/dev/null || echo No previous build to back up
              "
            """
            
            // Upload new build
            bat """
              pscp -batch -i "${SSH_KEY_PATH}" -r build %DO_USER%@%DO_HOST%:%REMOTE_DIR%/
            """
            
            // Start new server
            bat """
              plink -batch -ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "
                cd %REMOTE_DIR%/build
                nohup npx serve -s . -l %PORT% > serve.log 2>&1 &
                echo ✅ React app started on port %PORT%.
              "
            """
          } catch (err) {
            // Rollback if deployment fails
            bat """
              plink -batch -ssh -i "${SSH_KEY_PATH}" %DO_USER%@%DO_HOST% "
                cd %REMOTE_DIR%
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