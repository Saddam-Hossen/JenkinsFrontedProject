pipeline {
    agent any
    
    environment {
        NODE_VERSION = '22.14.0'  // Matches your Node version
        CI = 'true'               // Ensures React runs in CI mode
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js v22.14.0') {
            steps {
                script {
                    // Verify Node.js is installed (alternative to using Jenkins NodeJS plugin)
                    sh '''
                        node -v
                        npm -v
                    '''
                    
                    // If you need to ensure specific version
                    sh 'nvm use 22.14.0 || nvm install 22.14.0'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci --no-audit'  // Clean install with no audit (faster)
                sh 'npm cache verify'    // Verify cache integrity
            }
        }
        
        stage('Security Audit') {
            steps {
                sh 'npm audit --omit=dev'  // Check for vulnerabilities (optional)
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'  // If you have ESLint/Prettier setup
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'npm test -- --watchAll=false --coverage'
                junit 'junit.xml'  // If your tests generate JUnit reports
                // For Jest coverage reports:
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: false,
                    reportDir: 'coverage/lcov-report',
                    reportFiles: 'index.html',
                    reportName: 'Jest Coverage Report'
                ])
            }
        }
        
        stage('Build Production') {
            steps {
                sh 'npm run build'
                
                // Verify build output
                sh 'ls -la build/'
                
                // Archive artifacts
                archiveArtifacts artifacts: 'build/**/*', fingerprint: true
            }
        }
        
        
    }
    
    post {
        success {
            // Optional notifications
            slackSend(color: 'good', message: "✅ Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
            emailext(
                subject: "SUCCESS: Job '${env.JOB_NAME}' (${env.BUILD_NUMBER})",
                body: "Build successful!\nCheck console output at ${env.BUILD_URL}",
                to: 'dev-team@example.com'
            )
        }
        failure {
            slackSend(color: 'danger', message: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME}' (${env.BUILD_NUMBER})",
                body: "Build failed!\nCheck console output at ${env.BUILD_URL}",
                to: 'dev-team@example.com'
            )
        }
        always {
            cleanWs()
            script {
                // Clean up node_modules to save disk space
                sh 'rm -rf node_modules/'
            }
        }
    }
}