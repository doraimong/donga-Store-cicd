pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    docker.build('your-node-app')
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('', 'your-dockerhub-credentials') {
                        docker.image('your-node-app').push('latest')
                    }
                    sshagent (credentials: ['your-ssh-credentials-id']) {
                        sh 'ssh -o StrictHostKeyChecking=no ec2-user@your-ec2-public-dns docker pull your-dockerhub-username/your-node-app:latest'
                        sh 'ssh -o StrictHostKeyChecking=no ec2-user@your-ec2-public-dns docker-compose up -d'
                    }
                }
            }
        }
    }
}
