pipeline {
  agent any

  environment {
    SSH_KEY_PATH = '/tmp/key.pem'
    REMOTE_DIR = '/www/wwwroot/CITSNVN/itcrashcourse'
    PORT = '3084'
    DO_SSH_KEY = credentials('DO_SSH_KEY')
    DO_USER = credentials('DO_USER')
    DO_HOST = credentials('DO_HOST')
  }

  stages {
    stage('Install Dependencies') {
      agent {
        docker {
          image 'node:22.13.1'
        }
      }
      steps {
        echo 'Installing dependencies...'
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

    stage('Deploy to DigitalOcean') {
      agent {
        docker {
          image 'alpine:latest'
        }
      }
      steps {
        echo 'Starting deployment to DigitalOcean...'

        sh '''
          apk add --no-cache openssh lsof nodejs npm

          mkdir -p ~/.ssh
          chmod 700 ~/.ssh

          echo "$DO_SSH_KEY" | tr -d '\\r' > $SSH_KEY_PATH
          chmod 600 $SSH_KEY_PATH

          echo "$DO_HOST" | xargs -I {} ssh-keyscan -H {} >> ~/.ssh/known_hosts

          echo "🔪 Killing process on port $PORT..."
          ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $DO_USER@$DO_HOST '
            PID=$(lsof -t -i:$PORT)
            if [ -n "$PID" ]; then
              kill -9 $PID && echo "✅ Process on port $PORT killed."
            else
              echo "⚠️ No process found on port $PORT."
            fi
            cd $REMOTE_DIR
            echo "📦 Backing up current build..."
            mv build build.bak || echo "No previous build to back up"
          '

          echo "📤 Uploading new build..."
          scp -i $SSH_KEY_PATH -o StrictHostKeyChecking=no -r build $DO_USER@$DO_HOST:$REMOTE_DIR/

          echo "🚀 Starting React app on port $PORT..."
          ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $DO_USER@$DO_HOST '
            cd $REMOTE_DIR/build
            nohup npx serve -s . -l $PORT > serve.log 2>&1 &
            echo "✅ React app started on port $PORT."
          '

          echo "🔁 Rollback logic check..."
          ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $DO_USER@$DO_HOST '
            cd $REMOTE_DIR
            if [ ! -d build ]; then
              echo "❌ Deployment failed. Rolling back..."
              mv build.bak build
              echo "🔁 Rollback complete."
            else
              echo "✅ Deployment successful."
            fi
          '
        '''
      }
    }
  }
}
