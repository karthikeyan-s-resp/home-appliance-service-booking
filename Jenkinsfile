pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'cd server && npm install'
                bat 'cd client && npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'cd server && npm test -- --passWithNoTests'
            }
        }

        stage('Result') {
            steps {
                echo 'Build and Test completed successfully.'
            }
        }
    }
}