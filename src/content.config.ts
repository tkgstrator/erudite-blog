import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { licenseSchema } from './lib/data-utils'

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      authors: z.array(z.string()).optional(),
      date: z.coerce.date(),
      description: z.string(),
      draft: z.boolean().optional(),
      image: image().optional(),
      isSubpost: z.boolean().default(false),
      license: z
        .preprocess((val) => {
          if (!val) return null
          if (typeof val !== 'string') {
            throw new Error(`Invalid license format: ${val}`)
          }

          const match = val.match(/cc(?:\s|-)(by|sa|nc|nd|zero)(?:\s(\d+\.\d+))?/)
          if (!match) throw new Error(`Invalid license format: ${val}`)
          const type = match[1]
          const version = match[2] ? match[2] : undefined

          const result = licenseSchema.safeParse({
            type,
            version
          })
          if (!result.success) {
            console.warn(`Invalid license format: ${val}. Error: ${result.error.message}`)
            return null
          }
          return result.data
        }, licenseSchema)
        .optional(),
      order: z.number().optional(),
      tags: z.array(z.string()).optional(),
      title: z.string()
    })
})

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    avatar: z.string().url().or(z.string().startsWith('/')),
    bio: z.string().optional(),
    discord: z.string().url().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    mail: z.string().email().optional(),
    name: z.string(),
    pronouns: z.string().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional()
  })
})

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      description: z.string(),
      endDate: z.coerce.date().optional(),
      image: image(),
      link: z.string().url(),
      name: z.string(),
      startDate: z.coerce.date().optional(),
      tags: z.array(z.string())
    })
})

export const collections = { authors, blog, projects }
