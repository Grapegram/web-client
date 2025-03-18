export default {
  '*.{js,ts,vue}': ['npm run precommit:format', 'npm run precommit:lint'],
  '*': _ => ['npm run precommit:lint-arch'],
  '*.json': ['npm run dev:format']
}
