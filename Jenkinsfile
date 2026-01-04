pipeline {
    agent any

    parameters {
        string(name: 'APP_VERSION', defaultValue: 'latest', description: 'Tag/versión de la imagen Docker')
        booleanParam(name: 'DO_BUILD', defaultValue: true, description: '¿Construir la imagen Docker?')
        booleanParam(name: 'DO_PUSH', defaultValue: true, description: '¿Hacer push a DockerHub?')
    }

    environment {
        DOCKERHUB_USER = 'pruebasceste'
        IMAGE_NAME     = 'ceste-ci-demo'
        SONAR_HOST_URL = 'http://localhost:9000'
        SONAR_TOKEN    = credentials('sonar-token')   // Usa credencial segura en Jenkins
        DOCKERHUB_TOKEN = credentials('dockerhub-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Tests (npm)') {
            steps {
                bat 'npm ci > logs/npm-install.log 2>&1'
                bat 'npm test > logs/npm-test.log 2>&1'
                archiveArtifacts artifacts: 'logs/npm-*.log', fingerprint: true
            }
        }

        stage('Build app') {
            steps {
                bat 'npm run build > logs/npm-build.log 2>&1'
                archiveArtifacts artifacts: 'dist/**, logs/npm-build.log', fingerprint: true
            }
        }

        stage('SonarQube / Quality') {
            steps {
                bat """
                    sonar-scanner ^
                      -Dsonar.projectKey=ceste-ci-demo ^
                      -Dsonar.sources=. ^
                      -Dsonar.host.url=%SONAR_HOST_URL% ^
                      -Dsonar.login=%SONAR_TOKEN% > logs/sonar.log 2>&1
                """
                archiveArtifacts artifacts: 'logs/sonar.log', fingerprint: true
            }
        }

        stage('Build Docker') {
            when { expression { params.DO_BUILD } }
            steps {
                bat """
                    docker build --target prod -t %DOCKERHUB_USER%/%IMAGE_NAME%:%APP_VERSION% . > logs/docker-build.log 2>&1
                """
                archiveArtifacts artifacts: 'logs/docker-build.log', fingerprint: true
            }
        }

        stage('Trivy Scan') {
            steps {
                bat "trivy image --severity HIGH,CRITICAL --exit-code 1 %DOCKERHUB_USER%/%IMAGE_NAME%:%APP_VERSION% > logs/trivy.log 2>&1"
                archiveArtifacts artifacts: 'logs/trivy.log', fingerprint: true
            }
        }
        stage('OWASP ZAP Scan') { 
            steps { 
            // Usando la imagen oficial de ZAP en Docker 
            bat """ 
                docker run --rm -v %WORKSPACE%/logs:/zap/wrk owasp/zap2docker-stable zap-baseline.py \ 
                -t http://localhost:8080 \ 
                -r zap-report.html > logs/zap.log 2>&1 
                """ 
                // Archivar el reporte y los logs 
                archiveArtifacts artifacts: 'logs/zap.log', fingerprint: true 
                archiveArtifacts artifacts: 'zap-report.html', fingerprint: true 
            } 
        }

        stage('Push DockerHub') {
            when { expression { params.DO_PUSH } }
            steps {
                bat """
                    docker login -u %DOCKERHUB_USER% -p %DOCKERHUB_TOKEN% > logs/docker-login.log 2>&1
                    docker push %DOCKERHUB_USER%/%IMAGE_NAME%:%APP_VERSION% > logs/docker-push.log 2>&1
                """
                archiveArtifacts artifacts: 'logs/docker-*.log', fingerprint: true
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'logs/*.log', fingerprint: true
        }
    }
}