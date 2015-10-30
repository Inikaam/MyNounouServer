# Mode d’emploi de l’API MyNounou

## Prérequis
* NodeJS
* MongoDB
* NPM

## Installation
1. Lancer mongodb
2. Cloner le projet MyNounou_Server
3. Ouvrir une console dans le dossier du projet git
4. npm install
5. Une fois les dépendances installées, lancer le serveur (node app.js)

## Notes complémentaires
* L’API utilise la base de données “mynounou” dans mongodb
* Le serveur utilise le port 8080
* Pensez à refaire un npm install quand vous faites un update du serveur
* Le serveur renvoie toujours un code HTTP aux requêtes, avec des données complémentaires lorsqu’il le peut. Pensez à checker ce code et les éventuelles données d’erreur qui l’accompagnent.
* Les requêtes POST renvoie les données enregistrées avec le nouvel ID

## Utilisation de l’API
L’API utilise l’architecture REST. Il y a 3 objets de données :
* Nanny
* Parent
* Chat (messagerie interne de l’appli)

Chaque URL est protégée par un token qui doit être fourni en paramètre de l'URL pour pouvoir y accéder.

_Exemple : /api/nannies?token=my-token_

### Réponses
Les réponses du serveur sont toujours un objet contenant les champs suivants :
* **success :** true si la requête réussit, false sinon
* **message :** message de succès ou d'erreur
* **data :** donnée ou tableau de données demandée(s), n'existe pas en cas d'erreur
* **token :** le token d'authentification, n'apparait que dans les réponses d'authentification

### Authentification
* **URLs**
  * **Authentification nounou :** POST /api/login-nanny
  * **Créer un compte nounou :** POST /api/nannies
  * **Authentification parent :** POST /api/login-parent
  * **Créer un compte parent :** POST /api/parents

**Note :** Seule l'authentification renvoie le token de connexion, il faut donc s'authentifier après s'être inscrit.

### Nounous
* **Collection :** nannies
* **Règles**
  * On ne peut modifier ou supprimer que son propre profil
* **URLs**
  * **Liste des nounous :** GET /api/nannies
  * **Une nounou :** GET /api/nannies/{id-de-nounou}
  * **Modifier une nounou :** PUT /api/nannies/{id-de-nounou}
  * **Supprimer une nounou :** DELETE /api/nannies/{id-de-nounou}
  * **Commentaires sur une nounou :** GET /api/nannies/{id-de-nounou}/comments
  * **Ajouter un commentaire sur une nounou :** POST /api/nannies/{id-de-nounou}/comments
  * **Supprimer un commentaire sur une nounou :** DELETE /api/nannies/{id-de-nounou}/comments/{id-du-commentaire}

### Objet Nanny
* **email :** (String, required) mail de la nounou
* **date_add :** (Date) date de création
* **date_upd :** (Date) date de dernière mise à jour
* **firstname :** (String) Prénom de la nounou
* **lastname :** (String) Nom de famille de la nounou
* **password :** (String, indisponible en GET) Mot de passe de la nounou
* **age :** (Int) Age de la nounou
* **gender :** (String) “H” pour homme, “F” pour femme
* **type :** (String) “nanny” pour une nounou, “babysitter” pour une baby-sitter
* **tel :** (String) numéro de tel de la nounou
* **pic :** (String, Url) portrait de la nounou
* **video :** (String, Url) vidéo de présentation de la nounou
* **price :** (Float) tarif à l’heure de la nounou, en euros (€)
* **comments :** Tableau de données
  * **id_parent :** (String) ID du parent ayant posté le commentaire
  * **date :** (Date) date de création du commentaire
  * **note :** (Float) note de la prestation donnée par le parent, allant de 0 à 5
  * **text :** (String) commentaire du parent sur 255 caractères
* **dispos :** objet contenant chaque jour de la semaine notés de la façon suivante : lun, mar, mer, jeu, ven, sam, dim. Chaque entrée contient un tableau d’objets formatés ainsi :
  * **start :** (String) Heure de début de la disponibilité pour le jour donné 
(format “09:00”)
  * **end :** (String) Heure de fin de la disponibilité pour le jour donné
(format “12:00”)
* **restrictions :** Tableau de données
  * **start :** (Date) date et heure de début d’indisponibilité
  * **end :** (Date) date et heure de fin d’indisponibilité
  * **reason :** (String) raison de l’indisponibilité (réservation, congé, etc)
  * **id_parent :** (String) ID du parent concerné s’il s’agit d’une réservation, null sinon

### Parents
* **Collection :** parents
* **Règles**
  * On ne peut modifier ou supprimer que son propre profil
* **URLs**
  * **Liste des parents :** GET /api/parents
  * **Un parent :** GET /api/parents/{id de bdd}
  * **Modifier un parent :** PUT /api/parents/{id de bdd}
  * **Supprimer un parent :** DELETE /api/parents/{id de bdd}

### Objet Parent
* **email :** (String, required) mail du parent
* **date_add :** (Date) date de création
* **date_upd :** (Date) date de dernière mise à jour
* **firstname :** (String) Prénom du parent
* **lastname :** (String) Nom de famille du parents
* **password :** (String, indisponible en GET) Mot de passe du parent
* **age :** (Int) Age du parent
* **gender :** (String) “H” pour homme, “F” pour femme
* **pic :** (String, Url) portrait du parent
* **video :** (String, Url) vidéo de présentation du parent
* **favoris :** Tableau de Strings, référence à id_nounou

### Conversations
* **Collection :** chats
* **Règles**
  * On ne peut accéder qu'aux conversations auxquelles on a participé
* **URLs**
  * **Liste des conversations pour un parent, une nounou ou les deux :** GET /api/chats?parent={id_du_parent}&nanny={id_de_la_nounou}
    * Il faut au moins un des deux paramètres de filtrage
  * **Une conversation :** GET /api/chats/{id de bdd}
  * **Ajouter une conversation :** POST /api/chats
  * **Modifier une conversation :** PUT /api/chats/{id de bdd}
    * Utiliser cette méthode pour ajouter un message dans une conversation existante
  * **Supprimer une conversation :** DELETE /api/chats/{id de bdd}

### Objet Chat
* **id_nanny :** (String) ID de la nounou ayant participé à la conversation
* **id_parent :** (String) ID du parent ayant participé à la conversation
* **messages :** Tableau de données
  * **date :** (Date) date de création du message
  * **message :** (String) contenu du message
