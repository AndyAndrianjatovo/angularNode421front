# AssignmentApp

C'est la suite du partie Front-end du TP sur les Assignments vue dans le cours.

## Lancement du projet

Pour lancer le projet :
- Cloner ce repository,
- Lancer le [Back-end](https://github.com/TokyRandrian/nodeAngular421api) dans le cas où on a le back-end localement
- Aller dans le projet puis faire `npm install`
- Lancer `ng serve` pour lancer le client. Ouvrir ensuite l'URL affiché.

## Nos contributions sur le projet

Pour faire le projet on a utilisé des composants issus de [Angular material](https://material.angular.io). Pour le design on s'est inspiré des designs sur [dribbble](https://dribbble.com) mais aucun template n'a été utilisé.

### Hébergement et connexion

- Le site est hébergé sur [heroku](https://angularnode421front.herokuapp.com) et on a créé un login de connexion prêt à l'emploi:
  - Nom : Michel Buffa
  - Mot de passe : 0000

### Login et inscription

- On a utilisé JWT pour gérer la connexion, on a suivi le [tuto](https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/) qui a été donné dans le cours pour le faire.
- On a aussi implementé une page d'inscription où on peut choisir le type de profil, mettre le nom, le mot de passe et importer une photo qui sera transformer en base64 et enregistrer dans la base de données MongoDB.

### Les fonctionnalités présent dans le projet

#### Gestion des devoirs

- Arrivé sur la page home on a listé les devoirs avec un système de ***drag and drop*** sur 2 colonnes appuyés par une ***pagination***. L'un des colonnes étant la liste des devoirs non rendus et l'autre des devoirs rendus.
- Un devoir est représenté par un card où on trouve ***le nom du devoir, le nom de la matière, l'image associé à la matière, le nom de l'élève, la date de rendu et la photo du professeur***.
- Pour rendre un devoir il suffit de déplacer le devoir dans la colonne des devoirs rendu et ***un pop-up apparaitra pour mettre une note et des remarques***.
- Il y a une possibilité d'annuler le rendu d'un devoir en le déplacant dans la colonne des devoirs non rendus un pop-up de confirmation apparaitra pour confirmation. 
- On a utilisé un ***stepper*** pour le formulaire d'ajout d'un devoir. 
- Pour voir les détails d'un devoir on n'a qu'à clicker dessus.
- Dans les détails si l'utilisateur connecter est un Admin ou un Professeur les boutons pour la modification et la suppression seront disponibles.

#### Fonctionnalités en plus

- On a ajouter un calendrier où l'on peut voir en dessous les devoirs qui ont des dates de rendus égales à la date séléctionné, ils sont clickable si on veut voir les détails.
- On a ajouter une fonction de ***recherche simple*** par le nom des devoirs.
- Pour chaque action effectuer (ajout, modification, suppression) un ***snackbar*** de notification apparait.
- On a ajouter une barre de navigation qui affiche la photo de l'utilisateur connecter, de son nom, de son profil et on peut clicker dessur pour ***se déconnecter***.

## Nous
- ANDRIANJATOVONIAINA Andy Tsiory n°04 ([@AndyAndrianjatovo](https://github.com/AndyAndrianjatovo))
- RANDRIANIMANANA Tokiniaina Maminiriana Fahendrena n°21 ([@TokyRandrian](https://github.com/TokyRandrian))
