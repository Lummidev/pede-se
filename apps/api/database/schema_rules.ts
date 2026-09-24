import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

export default {
  tables: {
    roles: {
      columns: {
        name: {
          tsType: `"admin" | "operator" | null`,
        },
      },
    },
  },
} satisfies SchemaRules
