## Repro steps

1. `yarn`
2. `yarn ts-node index.ts`

## Expected
The child process should receive a message from the parent process.

## Actual
The child process never sees any messages.

Reverting to ts-node@9.0.0 fixes the issue:

1. `yarn add ts-node@9.0.0`
2. `yarn ts-node index.ts`
