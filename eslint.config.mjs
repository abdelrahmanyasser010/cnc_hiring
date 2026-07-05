import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**"
    ]
  },
  // Boundary constraints (Sprint 4)
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        {
          type: "presentation",
          pattern: "src/presentation/**/*"
        },
        {
          type: "application",
          pattern: "src/application/**/*"
        },
        {
          type: "domain",
          pattern: "src/domain/**/*"
        },
        {
          type: "infrastructure",
          pattern: "src/infrastructure/**/*"
        }
      ]
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "presentation",
              allow: ["presentation", "application", "domain", "infrastructure"]
            },
            {
              from: "application",
              allow: ["application", "domain"]
            },
            {
              from: "domain",
              allow: ["domain"]
            },
            {
              from: "infrastructure",
              allow: ["infrastructure", "application", "domain"]
            }
          ]
        }
      ]
    }
  },
  // Restrict database/SDK imports (Sprint 4)
  {
    files: [
      "src/presentation/**/*",
      "src/application/**/*",
      "src/domain/**/*",
      "src/app/**/*",
      "src/components/**/*"
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/db",
              message: "Direct database access is forbidden. Inject repository ports in the application layer or use infrastructure adapters."
            },
            {
              name: "@prisma/client",
              message: "Direct Prisma Client imports are forbidden outside the infrastructure layer."
            }
          ]
        }
      ]
    }
  }
]);

export default eslintConfig;
