import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articlesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    displayTitle: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    dateDisplay: z.string().optional(),
    publishedDate: z.coerce.date().optional(),
    modifiedDate: z.coerce.date().optional(),
    author: z.string().default('Grzegorz Tomicki'),
    thumbnail: z.string().optional(),
    thumbnailAlt: z.string().optional(),
    folder: z.string().optional(),
    images: z.array(z.object({
      filename: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })).optional(),
  }),
});

export const collections = {
  articles: articlesCollection,
};
