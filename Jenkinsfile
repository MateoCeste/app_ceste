pipeline {
    agent any

    parameters {
        string(
            name: 'APP_VERSION',
            defaultValue: 'latest',
            description: 'Tag/versión de la imagen Docker'
        )
        booleanParam(
            name: 'DO_BUILD',
            defaultValue: true,
            description: '¿Construir la imagen Docker?'
        )
        booleanParam(
            name: 'DO_PUSH',
            defaultValue: true,
            description: '¿Hacer push a DockerHub?'
        )
    }

    environment {
        DOCKERHUB_USER = 'pruebasceste'
        IMAGE_NAME     = 'ceste-ci-demo'
        SONAR_HOST_URL = 'http://localhost:9000'
        SONAR_TOKEN = 'squ_b1a9d61247f83e988121cdaed0579abc150b9c22'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Tests (npm)') {
            steps {
                // Instalación de dependencias y ejecución de tests
                bat 'npm install'
                bat 'npm test'
            }
        }

        stage('Build app') {
            steps {
                // Generar la carpeta dist/ con el “build” del proyecto
                bat 'npm run build'

                // Archivar dist/ como artefacto en Jenkins (opcional)
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }

        stage('SonarQube / Quality') {
            steps {
                bat """
                    sonar-scanner ^
                      -Dsonar.projectKey=ceste-ci-demo ^
                      -Dsonar.sources=. ^
                      -Dsonar.host.url=http://localhost:9000 ^
                      -Dsonar.login=%SONAR_TOKEN%
                """
            }
        }

        stage('Build Docker') {
            when {
                expression { params.DO_BUILD }
            }
            steps {
                bat """
                    docker build -t %DOCKERHUB_USER%/%IMAGE_NAME%:%APP_VERSION% .
                """
            }
        }

        stage('Trivy Scan') {
            steps {
                // Escaneo de la imagen recién construida
                bat "trivy image --severity HIGH,CRITICAL --exit-code 1 %DOCKERHUB_USER%/%IMAGE_NAME%:%APP_VERSION%"
            }
        }

        stage('Push DockerHub') {
            when {
                expression { params.DO_PUSH }
            }
            steps {
                bat """
                    docker login -u %DOCKERHUB_USER% -p %DOCKERHUB_TOKEN%
                    docker push %DOCKERHUB_USER%/%IMAGE_NAME%:%APP_VERSION%
                """
            }
        }
    }
}
