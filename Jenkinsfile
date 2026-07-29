
pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Repository cloned successfully.'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Pipeline Completed') {
            steps {
                echo 'Node.js MERN Pipeline Executed Successfully!'
            }
        }
    }
}
