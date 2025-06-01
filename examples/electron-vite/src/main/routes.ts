import { declareRoutes } from '@codevault/electron-ipc-server'

type UserArguments = {
  id: string
}

export const userRoutes = declareRoutes({
  'user:get': {
    handler: async (args: UserArguments): Promise<{ id: string; name: string }> => {
      const users = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '123', name: 'Charlie' }
      ]

      const user = users.find((u) => u.id === args.id)

      if (!user) {
        throw new Error(`User not found: ${args.id}`)
      }

      return user
    },
    isStream: false
  },
  'system:logs': {
    handler: async function* (args: { count: number }) {
      for (let i = 0; i < args.count; i++) {
        yield `Log line ${i + 1}`
      }
    },
    isStream: true
  }
})
