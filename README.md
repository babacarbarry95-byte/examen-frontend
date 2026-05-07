# React + TypeScript + Vite

## FABY Hotel chat widget

Le projet inclut maintenant un widget de chat flottant emerald pour contacter la reception.

- Sans configuration, le site affiche un mode `demo` avec une messagerie locale persistee dans `localStorage`.
- Avec Tawk.to configure, le widget charge automatiquement le script Tawk et vous repondez ensuite depuis le tableau de bord Tawk.

### Activer Tawk.to

1. Creez un fichier `.env.local` a la racine de `reservationHotel`.
2. Ajoutez vos identifiants Tawk :

```env
VITE_TAWK_PROPERTY_ID=YOUR_PROPERTY_ID
VITE_TAWK_WIDGET_ID=YOUR_WIDGET_ID
```

3. Redemarrez le serveur Vite.

Le composant construit l'URL du script Tawk sous la forme :

```text
https://embed.tawk.to/{VITE_TAWK_PROPERTY_ID}/{VITE_TAWK_WIDGET_ID}
```

Pour harmoniser le widget reel avec le theme emerald du site, reglez ensuite les couleurs directement dans le tableau de bord Tawk.

Si les variables ne sont pas renseignees, le mode demo reste actif pour les presentations et tests locaux.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
