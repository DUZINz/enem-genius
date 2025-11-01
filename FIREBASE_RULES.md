# 🔒 Firebase Security Rules

## Estrutura do Firestore

### Coleção: `users`
- Cada documento tem o `userId` como ID
- Apenas o próprio usuário pode ler/escrever seus dados
- UID e email são validados na criação/atualização
- Deleção bloqueada (apenas via console)

### Coleção: `redacoes`
- Usuários só acessam suas próprias redações
- Campo `userId` obrigatório

### Coleção: `simulados`
- Usuários só acessam seus próprios simulados
- Campo `userId` obrigatório

## Atualizar Regras

1. Acesse: Firebase Console → Firestore → Regras
2. Edite conforme necessário
3. Clique em "Publicar"
4. Teste imediatamente

## Segurança

- ✅ Dados protegidos por autenticação
- ✅ Validação de UID e email
- ✅ Isolamento entre usuários
- ✅ Sem expiração