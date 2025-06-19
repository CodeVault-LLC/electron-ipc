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
  'user:all': {
    handler: async (limit: number): Promise<{ id: string; name: string }[]> => {
      const users = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' }
      ]

      if (limit > users.length) {
        throw new Error(`Limit exceeds available users: ${limit}`)
      }

      return users.slice(0, limit)
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
