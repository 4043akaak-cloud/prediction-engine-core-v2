import { getDb } from './db';
import { recipes } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const systemRecipes = [
  {
    id: 'sys-recipe-001',
    name: 'Financial Forecast',
    description: 'Predict market trends and financial outcomes using multiple economic indicators',
    type: 'SYSTEM' as const,
    category: 'FINANCE' as const,
    status: 'ACTIVE' as const,
    version: 1,
    displayOrder: 1,
  },
  {
    id: 'sys-recipe-002',
    name: 'Sports Predictor',
    description: 'Forecast sports match outcomes and player performance using historical data',
    type: 'SYSTEM' as const,
    category: 'SPORTS' as const,
    status: 'ACTIVE' as const,
    version: 1,
    displayOrder: 2,
  },
  {
    id: 'sys-recipe-003',
    name: 'Weather Analyst',
    description: 'Predict weather patterns and natural phenomena with meteorological models',
    type: 'SYSTEM' as const,
    category: 'WEATHER' as const,
    status: 'ACTIVE' as const,
    version: 1,
    displayOrder: 3,
  },
  {
    id: 'sys-recipe-004',
    name: 'Tech Trend Scout',
    description: 'Forecast technology trends and industry disruptions',
    type: 'SYSTEM' as const,
    category: 'TECHNOLOGY' as const,
    status: 'ACTIVE' as const,
    version: 1,
    displayOrder: 4,
  },
  {
    id: 'sys-recipe-005',
    name: 'Health Insights',
    description: 'Predict health outcomes and wellness trends based on available data',
    type: 'SYSTEM' as const,
    category: 'HEALTH' as const,
    status: 'ACTIVE' as const,
    version: 1,
    displayOrder: 5,
  },
];

export async function seedSystemRecipes() {
  try {
    const db = await getDb();
    if (!db) {
      console.log('[Seed] Database not available, skipping seed');
      return;
    }

    // Check if recipes already exist
    const existing = await db.select().from(recipes).where(eq(recipes.type, 'SYSTEM')).limit(1);

    if (existing.length > 0) {
      console.log('[Seed] SYSTEM recipes already exist, skipping seed');
      return;
    }

    // Insert recipes using raw SQL to avoid enum issues
    for (const recipe of systemRecipes) {
      try {
        await db.insert(recipes).values({
          ...recipe,
          isPublic: 0,
        });
        console.log(`[Seed] ✓ Seeded: ${recipe.name}`);
      } catch (err) {
        console.error(`[Seed] Failed to seed ${recipe.name}:`, err);
      }
    }
    console.log('[Seed] ✓ All SYSTEM recipes seeded successfully');
  } catch (error) {
    console.error('[Seed] ✗ Seeding failed:', error);
  }
}
