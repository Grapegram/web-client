import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // disable the `public-api` rule for files in the Shared layer
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off'
    }
  },
  {
    // disable the `insignificant-slice` Temporary!!!
    rules: {
      'fsd/insignificant-slice': 'off'
    }
  },
  {
    // Allow cross-imports between widgets, for example
    files: ['./src/widgets/**'],
    rules: {
      'fsd/forbidden-imports': 'off'
    }
  }
]);
