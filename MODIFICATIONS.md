# Modifications réalisées

Ce document récapitule les modifications présentes dans le projet pour faire fonctionner l'authentification, le profil utilisateur et l'affichage des comptes bancaires.

## 1. Gestion globale de l'authentification avec Redux

### `src/features/auth/authSlice.js`

- Création et utilisation de thunks Redux Toolkit pour communiquer avec l'API :
  - connexion via `POST /api/v1/user/login` ;
  - récupération du profil via `GET /api/v1/user/profile` ;
  - modification du nom utilisateur via `PUT /api/v1/user/profile`.
- Ajout de la gestion des états `loading`, `error`, `token`, `user` et `isLoggedIn`.
- Lecture du token depuis `localStorage` au démarrage de l'application.
- Enregistrement du token dans `localStorage` après une connexion réussie.
- Suppression du token lors de la déconnexion.
- Ajout automatique du token dans l'en-tête `Authorization` des requêtes protégées.
- Ajout de messages d'erreur lorsque l'API répond avec une erreur ou est inaccessible.
- Mise à jour du profil Redux après la modification du nom utilisateur.

### `src/app/store.js`

- Ajout du reducer d'authentification dans le store Redux.
- Ajout du reducer des comptes bancaires dans le store Redux.

## 2. Récupération des comptes bancaires

### `src/features/accounts/accountsSlice.js`

- Création d'un nouveau slice Redux dédié aux comptes bancaires.
- Ajout du thunk `fetchAccounts` qui appelle `GET /api/v1/accounts`.
- Transmission du token de connexion dans l'en-tête `Authorization`.
- Gestion des trois états de la requête : chargement, succès et erreur.
- Stockage des comptes reçus dans `state.accounts`.

## 3. Affichage du profil et des comptes

### `src/pages/Profile.jsx`

- Chargement du profil utilisateur et des comptes bancaires à l'ouverture de la page.
- Affichage du prénom et du nom de l'utilisateur connecté.
- Ajout du bouton `Edit Name` pour ouvrir le formulaire de modification.
- Ajout des actions `Save` et `Cancel` pour modifier ou annuler le changement de nom.
- Envoi du nouveau nom à l'API et fermeture du formulaire uniquement après une réponse réussie.
- Affichage d'un message pendant le chargement des comptes.
- Affichage des erreurs provenant du slice des comptes.
- Affichage dynamique de chaque compte bancaire avec les données reçues par l'API.
- Ajout de la navigation vers `/accounts/{id}/transactions` depuis le bouton des transactions.

### `src/components/Account.jsx`

- Création du composant réutilisable représentant un compte bancaire.
- Affichage du nom du compte, du masque de compte et du solde.
- Formatage du solde en dollars avec deux décimales et séparateurs de milliers.
- Affichage du type de solde.
- Ajout du bouton `View transactions` et de son action de navigation.

## 4. Interface et styles

### `src/styles/Profile.css`

- Ajout des styles du profil, du formulaire de modification et de la liste des comptes.
- Ajout des styles des boutons d'édition, de sauvegarde, d'annulation et de consultation des transactions.
- Ajout de la mise en forme des messages de chargement et d'erreur.

### `src/styles/App.css`

- Ajout des styles généraux nécessaires à la page authentifiée et aux comptes bancaires.

### `src/styles/Header.css`

- Adaptation des styles de l'en-tête pour afficher correctement l'état connecté et les actions associées.

## 5. Persistance et fonctionnement général

- Le token reste disponible après un rechargement de page grâce à `localStorage`.
- Les données du profil et des comptes sont chargées depuis l'API lorsque la page profil est affichée.
- Les erreurs réseau et les réponses HTTP invalides sont traitées sans faire planter l'interface.
- Les composants utilisent le store Redux pour partager l'état entre les différentes pages.

## 6. Vérification

Les commandes prévues pour vérifier le projet sont :

```bash
npm run lint
npm run build
```
