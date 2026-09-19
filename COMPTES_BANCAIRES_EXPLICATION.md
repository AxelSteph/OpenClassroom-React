# Explication détaillée du rajout des comptes bancaires

Ce document explique précisément comment le projet a été étendu pour récupérer, stocker, afficher et naviguer vers les comptes bancaires de l’utilisateur connecté, en lien avec la documentation API Swagger.

## 1. Le point de départ : le store Redux

Le store global a été complété pour inclure un slice dédié aux comptes bancaires.

- Fichier : [src/app/store.js](src/app/store.js)

Le fichier contient :

- le reducer d’authentification : `auth`
- le reducer des comptes : `accounts`

Cela permet de centraliser l’état de l’application et de partager les données entre les composants.

### Code de base

```js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import accountsReducer from "../features/accounts/accountsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
  },
});
```

Le point important est que l’authentification et les comptes sont séparés, ce qui rend le code plus propre et plus facile à maintenir.

---

## 2. Le slice Redux pour les comptes bancaires

Le cœur du traitement des comptes se trouve dans :

- [src/features/accounts/accountsSlice.js](src/features/accounts/accountsSlice.js)

### Rôle du slice

Ce slice :

- initialise l’état initial des comptes : `[]`
- contient un état de chargement : `loading`
- contient un état d’erreur : `error`
- va appeler l’API backend pour récupérer les comptes
- va enregistrer les comptes reçus dans le store Redux

### État initial

```js
const initialState = {
  accounts: [],
  loading: false,
  error: null,
};
```

On retrouve ici :

- `accounts` : liste des comptes de l’utilisateur
- `loading` : indique si la requête est en cours
- `error` : contient l’erreur éventuelle

### La requête API

Le thunk `fetchAccounts` est créé avec `createAsyncThunk`.

```js
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",

  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(
        "http://localhost:3001/api/v1/accounts",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Impossible de récupérer les comptes"
        );
      }

      return data.body;
    } catch {
      return rejectWithValue(
        "Impossible de contacter le serveur"
      );
    }
  }
);
```

### Pourquoi le token est important ?

La requête est protégée. L’API ne renverra pas les comptes sans jeton valide, donc le frontend envoie :

```js
Authorization: Bearer ${token}
```

Cela correspond à la logique d’authentification déjà en place dans le store Redux.

### Gestion des états

Le slice gère 3 cas de figure :

- `pending` : la requête démarre
- `fulfilled` : la requête a réussi
- `rejected` : la requête a échoué

```js
extraReducers: (builder) => {
  builder
    .addCase(fetchAccounts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAccounts.fulfilled, (state, action) => {
      state.loading = false;
      state.accounts = action.payload;
    })
    .addCase(fetchAccounts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};
```

Le résultat de la requête est stocké dans `state.accounts`. C’est cette donnée qui sera ensuite affichée sur la page profil.

---

## 3. La page profil charge les comptes au démarrage

La page de profil est le point d’entrée principal pour l’affichage des comptes.

- Fichier : [src/pages/Profile.jsx](src/pages/Profile.jsx)

### Import du thunk des comptes

```js
import {
  fetchAccounts,
} from "../features/accounts/accountsSlice";
```

### Appel à l’ouverture de la page

```js
useEffect(() => {
  dispatch(fetchUserProfile());
  dispatch(fetchAccounts());
}, [dispatch]);
```

Cela signifie que dès que la page profil est ouverte :

1. on récupère les informations du profil utilisateur
2. on récupère la liste des comptes bancaires

### Récupération de l’état des comptes

```js
const {
  accounts,
  loading,
  error,
} = useSelector((state) => state.accounts);
```

Cela donne accès dans le composant à :

- `accounts` pour afficher les comptes
- `loading` pour afficher un message pendant le chargement
- `error` pour afficher une erreur si la récupération échoue

### Affichage du statut de chargement

```jsx
{loading && (
  <p className="status">
    Loading accounts...
  </p>
)}
```

### Affichage des erreurs

```jsx
{error && (
  <p className="profile-error">
    {error}
  </p>
)}
```

---

## 4. Le composant réutilisable pour afficher un compte bancaire

Le rendu visuel d’un compte est séparé dans un composant dédié :

- [src/components/Account.jsx](src/components/Account.jsx)

Ce composant reçoit des props et affiche :

- le nom du compte
- le masquage du numéro de compte
- le solde
- le type de solde
- le bouton “View transactions”

### Exemple de structure

```jsx
function Account({
  name,
  mask,
  balance,
  balanceType,
  onTransactions,
}) {
  return (
    <section className="account">
      <div className="account-content-wrapper">
        <h3 className="account-title">
          {name} (x{mask})
        </h3>

        <p className="account-amount">
          ${balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p className="account-amount-description">
          {balanceType}
        </p>
      </div>

      <div className="account-content-wrapper cta">
        <button
          className="transaction-button"
          onClick={onTransactions}
        >
          View transactions
        </button>
      </div>
    </section>
  );
}
```

### Ce que ce composant fait

- `name` : nom du compte (ex. Argent Bank Checking)
- `mask` : 4 derniers chiffres du compte
- `balance` : solde du compte
- `balanceType` : type de solde (ex. Available Balance)
- `onTransactions` : callback appelé lorsqu’on clique sur le bouton

### Mise en forme du solde

Le solde est affiché en dollars avec 2 décimales et séparateurs milliaires :

```js
balance.toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
```

Cela donne par exemple :

- 2082.79
- 10928.42

---

## 5. Le rendu des comptes sur la page profil

Toujours dans [src/pages/Profile.jsx](src/pages/Profile.jsx), les comptes sont affichés avec `.map()`.

```jsx
<div className="accounts-container">
  {accounts.map((account) => (
    <Account
      key={account.id}
      name={account.name}
      mask={account.mask}
      balance={account.balance}
      balanceType={account.balanceType}
      onTransactions={() =>
        handleTransactions(account.id)
      }
    />
  ))}
</div>
```

### Détails

- `key={account.id}` : clé React pour chaque élément
- `name={account.name}` : nom du compte
- `mask={account.mask}` : masque du numéro
- `balance={account.balance}` : solde du compte
- `balanceType={account.balanceType}` : type du solde
- `onTransactions={() => handleTransactions(account.id)}` : navigation vers la page des transactions du compte

---

## 6. Navigation vers la page des transactions

Le bouton “View transactions” déclenche une navigation vers une route dynamique.

Dans [src/pages/Profile.jsx](src/pages/Profile.jsx) :

```js
const handleTransactions = (accountId) => {
  navigate(`/accounts/${accountId}/transactions`);
};
```

Cela permet d’ouvrir une page dédiée à un compte donné.

Le routeur de l’application utilise ensuite cet identifiant pour afficher les transactions associées au compte.

---

## 7. Le design associé aux comptes

Les styles de la liste des comptes et des cartes comptes sont dans :

- [src/styles/Profile.css](src/styles/Profile.css)

### Les éléments stylés

- `.accounts-container` : conteneur des cartes comptes
- `.account` : carte du compte
- `.account-title` : titre du compte
- `.account-amount` : affichage du solde
- `.account-amount-description` : sous-titre de type de solde
- `.cta` : zone du bouton d’action
- `.transaction-button` : bouton “View transactions”

Exemple de style :

```css
.accounts-container {
  width: 80%;
  margin: 0 auto;
}

.account {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  margin-bottom: 30px;
  padding: 24px;

  border: 1px solid black;
  background-color: white;
  color: #2c3e50;
}
```

---

## 8. Le contrat API côté backend avec Swagger

Le backend documente les endpoints dans le fichier :

- [../ArgentBank-Backend-main/swagger.yaml](../ArgentBank-Backend-main/swagger.yaml)

Ce fichier sert de contrat technique entre le backend et le frontend.

### Endpoint principal des comptes

Dans Swagger, la route est :

```yaml
/accounts:
  get:
    security:
      - Bearer: []
    tags:
      - Account Module
    summary: Get user bank accounts
    description: Retrieve all accounts belonging to the authenticated user
    produces:
      - application/json
    responses:
      "200":
        description: Accounts retrieved successfully
        schema:
          $ref: "#/definitions/AccountsResponse"
```

### Ce que cela signifie

- la route est protégée par un token Bearer
- l’API renvoie la liste des comptes de l’utilisateur authentifié
- la réponse est structurée avec un `status`, un `message` et un `body`

### Exemple de réponse Swagger

```yaml
examples:
  application/json:
    status: 200
    message: Accounts retrieved successfully
    body:
      - id: "checking-8349"
        name: "Argent Bank Checking"
        mask: "8349"
        balance: 2082.79
        balanceType: "Available Balance"
```

Cela correspond exactement à ce que le frontend affiche dans les cartes comptes.

---

## 9. Les définitions Swagger des comptes

Les objets utilisés pour décrire les données sont dans `definitions`.

### `Account`

```yaml
Account:
  type: object
  properties:
    id:
      type: string
    name:
      type: string
    mask:
      type: string
    balance:
      type: number
      format: double
    balanceType:
      type: string
```

Voici le schéma exact des informations reçues par le frontend :

- `id` : identifiant unique du compte
- `name` : nom du compte
- `mask` : derniers chiffres du compte
- `balance` : solde du compte
- `balanceType` : texte du type de solde

### `AccountsResponse`

```yaml
AccountsResponse:
  type: object
  properties:
    status:
      type: integer
    message:
      type: string
    body:
      type: array
      items:
        $ref: "#/definitions/Account"
```

Cela confirme que le backend retourne bien un tableau d’objets `Account` dans `body`.

---

## 10. Les routes liées aux transactions

Le Swagger montre aussi les endpoints associés aux transactions d’un compte :

- `/accounts/{accountId}/transactions`
- `/accounts/{accountId}/transactions/{transactionId}`

Cela est important car le bouton “View transactions” ouvre cette route.

### Exemple Swagger

```yaml
/accounts/{accountId}/transactions:
  get:
    security:
      - Bearer: []
    tags:
      - Transaction Module
    summary: Get account transactions
    description: Retrieve transactions for a specific account
```

Le frontend s’appuie sur ce contrat pour naviguer vers les transactions après le chargement des comptes.

---

## 11. Le flux complet de travail

Le flux de données complet est donc le suivant :

1. l’utilisateur se connecte
2. le token est enregistré dans le store Redux et dans le localStorage
3. la page profil est chargée
4. le frontend appelle `fetchAccounts()`
5. le backend répond avec les comptes du client via `/api/v1/accounts`
6. les comptes sont stockés dans Redux
7. le composant [src/pages/Profile.jsx](src/pages/Profile.jsx) fait un `.map()` sur `accounts`
8. chaque compte est affiché via [src/components/Account.jsx](src/components/Account.jsx)
9. le bouton “View transactions” redirige vers la page des transactions du compte choisi

---

## 12. En résumé

Le rajout des comptes bancaires dans le projet repose sur trois éléments principaux :

- le slice Redux `accountsSlice` pour la récupération des données
- la page profil pour déclencher la requête et afficher les comptes
- le composant `Account` pour le rendu visuel de chaque carte

Et le contrat exact de cette API est documenté dans le fichier Swagger :

- [../ArgentBank-Backend-main/swagger.yaml](../ArgentBank-Backend-main/swagger.yaml)

Ce fichier confirme que la route `/accounts` renvoie bien la liste des comptes avec des informations comme :

- `id`
- `name`
- `mask`
- `balance`
- `balanceType`

C’est précisément ces données qui sont ensuite affichées dans l’interface utilisateur du projet.
