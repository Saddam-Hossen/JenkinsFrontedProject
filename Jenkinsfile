pipeline {
    agent { label 'windows' }

    environment {
        NODE_VERSION = '22.13.1'
        DEPLOY_DIR = '/www/wwwroot/CITSNVN/itcrashcourse'
        PORT = '3084'
        SSH_KEY_PATH = 'C:\\Users\\01957\\.ssh\\key.pem'
        KNOWN_HOSTS_PATH = 'C:\\Users\\01957\\.ssh\\do_known_hosts'
        DO_USER = credentials('do_user')     // define in Jenkins credentials
        DO_HOST = credentials('do_host')     // define in Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                bat "nvm install %NODE_VERSION% && nvm use %NODE_VERSION%"
            }
        }

        stage('Install Dependencies') {
            steps {
                bat "npm ci"
            }
        }

        stage('Lint') {
            steps {
                bat "npm run lint || echo ESLint completed with warnings"
            }
        }

        stage('Build') {
            steps {
                bat "set CI=false && npm run build"
                stash includes: 'build/**', name: 'react-build'
            }
        }

        stage('Download SSH Key') {
            steps {
                writeFile file: "${env.SSH_KEY_PATH}", text: "${env.DO_SSH_KEY}"
                bat "icacls ${env.SSH_KEY_PATH} /inheritance:r /grant:r \"%USERNAME%:R\""
                bat "ssh-keyscan -H %DO_HOST% >> %KNOWN_HOSTS_PATH%"
            }
        }

        stage('Upload Build') {
            steps {
                unstash 'react-build'
                bat """
                ssh -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% %DO_USER%@%DO_HOST% ^
                "echo 🔪 Killing process on port %PORT%... &&
                 PID=\\$(lsof -t -i:\\\$PORT) &&
                 if [ ! -z \\\"\\\$PID\\\" ]; then kill -9 \\\$PID && echo ✅ Process killed.; else echo ⚠️ No process.; fi &&
                 cd %DEPLOY_DIR% &&
                 echo 📦 Backing up... &&
                 mv build build.bak || echo 'No backup needed'"
                """

                bat """
                scp -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% -r build %DO_USER%@%DO_HOST%:%DEPLOY_DIR%
                """
            }
        }

        stage('Start Server') {
            steps {
                bat """
                ssh -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% %DO_USER%@%DO_HOST% ^
                "cd %DEPLOY_DIR%/build &&
                 echo 🚀 Starting server... &&
                 nohup npx serve -s . -l %PORT% > serve.log 2>&1 & &&
                 echo ✅ Server running on port %PORT%"
                """
            }
        }

        stage('Rollback') {
            steps {
                bat """
                ssh -i %SSH_KEY_PATH% -o StrictHostKeyChecking=no -o UserKnownHostsFile=%KNOWN_HOSTS_PATH% %DO_USER%@%DO_HOST% ^
                "cd %DEPLOY_DIR% &&
                 if [ ! -d build ]; then
                   echo ❌ Deployment failed. Rolling back... &&
                   mv build.bak build &&
                   echo 🔁 Rollback complete.;
                 else
                   echo ✅ Deployment successful.;
                 fi"
                """
            }
        }
    }
}
