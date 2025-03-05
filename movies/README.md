# Template Microservices avec MongoDB

## Auteur

Geoffroy Bellemare

## Description

Ce projet est un template pour le développement de microservices utilisant MongoDB comme base de données. Il fournit une structure de base pour démarrer rapidement le développement d'applications distribuées.

## Technologies utilisées

- MongoDB
- Docker & Docker Compose
- Node.js
- Express.js

## Prérequis

- Docker
- Docker Compose
- Node.js

## Installation

1. Cloner le repository

```bash
git clone <url-du-repo>
```

2. Lancer les conteneurs Docker

```bash
docker-compose up -d
```

## Structure du projet

```
.
├── docker-compose.yml
├── services/
│   ├── service1/
│   └── service2/
└── README.md
```

## Configuration

Les variables d'environnement peuvent être configurées dans le fichier `.env` à la racine du projet.

## Licence

MIT
