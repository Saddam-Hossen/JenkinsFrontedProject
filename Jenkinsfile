pipeline {
    agent { label 'windows' }

    environment {
        NODE_VERSION = '22.13.1'
        BUILD_DIR = 'build'
        DEPLOY_DIR = '/www/wwwroot/CITSNVN/itcrashcourse'
        SSH_KEY_PATH = 'C:\\Users\\01957\\.ssh\\key.pem'
        KNOWN_HOSTS_PATH = 'C:\\Users\\01957\\.ssh\\known_hosts'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Set up Node.js') {
            steps {
                bat """
                nvm install %NODE_VERSION%
                nvm use %NODE_VERSION%
                node -v
                npm -v
                """
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run ESLint') {
            steps {
                bat 'npm run lint || echo ESLint completed with warnings'
            }
        }

        stage('Build React App') {
            steps {
                bat 'set CI=false && npm run build'
            }
        }

        stage('Archive Build') {
            steps {
                archiveArtifacts artifacts: "${BUILD_DIR}/**", fingerprint: true
            }
        }

        stage('Prepare SSH') {
            steps {
                bat """
                if not exist %KNOWN_HOSTS_PATH% (
                    echo Creating known_hosts file...
                    ssh-keyscan -H %DO_HOST% >> %KNOWN_HOSTS_PATH%
                )
                """
            }
        }

        stage('Deploy to Server') {
            steps {
                bat """
                ssh -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% %DO_USER%@%DO_HOST% ^
                "PORT=3084 &&
                 PID=\\$(lsof -t -i:\\$PORT) &&
                 if [ ! -z \\"\\$PID\\" ]; then kill -9 \\$PID; fi &&
                 cd ${DEPLOY_DIR} &&
                 mv build build.bak || echo 'No backup needed'"
                """

                bat """
                scp -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% -r ${BUILD_DIR} %DO_USER%@%DO_HOST%:${DEPLOY_DIR}
                """
            }
        }

        stage('Start Server') {
            steps {
                bat """
                ssh -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% %DO_USER%@%DO_HOST% ^
                "cd ${DEPLOY_DIR}/build &&
                 nohup npx serve -s . -l 3084 > serve.log 2>&1 &"
                """
            }
        }

        stage('Rollback Logic') {
            steps {
                bat """
                ssh -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% %DO_USER%@%DO_HOST% ^
                "cd ${DEPLOY_DIR} &&
                 if [ ! -d build ]; then
                   echo '❌ Deployment failed. Rolling back...' &&
                   mv build.bak build &&
                   echo '🔁 Rollback complete.'
                 else
                   echo '✅ Deployment successful.'
                 fi"
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
