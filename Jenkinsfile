pipeline {
  agent any

  environment {
    SSH_KEY_PATH = '${WORKSPACE}/key.pem'
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
        sh '''
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
        sh '''
          # Create SSH directory and key file with proper permissions
          mkdir -p ~/.ssh
          chmod 700 ~/.ssh
          echo "$DO_SSH_KEY" > "$SSH_KEY_PATH"
          chmod 600 "$SSH_KEY_PATH"
          
          # Verify key file format (convert if needed)
          ssh-keygen -p -f "$SSH_KEY_PATH" -m pem -N "" || true
          
          # Add host to known_hosts
          ssh-keyscan -H "$DO_HOST" >> ~/.ssh/known_hosts
        '''
      }
    }

    stage('Deploy to DigitalOcean') {
      steps {
        script {
          try {
            // Kill existing process
            sh """
              ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" '
                PID=\$(lsof -t -i:$PORT || echo "")
                if [ -n "\$PID" ]; then
                  kill -9 \$PID
                  echo "✅ Process on port $PORT killed."
                else
                  echo "⚠️ No process found on port $PORT."
                fi
                cd "$REMOTE_DIR"
                rm -rf build.bak 2>/dev/null
                mv build build.bak 2>/dev/null || echo "No previous build to back up"
              '
            """
            
            // Upload new build
            sh """
              scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no -r build "$DO_USER@$DO_HOST:$REMOTE_DIR/"
            """
            
            // Start new server
            sh """
              ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" '
                cd "$REMOTE_DIR/build"
                nohup npx serve -s . -l $PORT > serve.log 2>&1 &
                echo "✅ React app started on port $PORT."
              '
            """
          } catch (err) {
            // Rollback if deployment fails
            sh """
              ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DO_USER@$DO_HOST" '
                cd "$REMOTE_DIR"
                if [ ! -d build ]; then
                  echo "❌ Deployment failed. Rolling back..."
                  mv build.bak build
                  echo "🔁 Rollback complete."
                fi
              '
            """
            error("Deployment failed: ${err.message}")
          }
        }
      }
    }
  }
}