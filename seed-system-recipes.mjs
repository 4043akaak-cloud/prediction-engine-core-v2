import { getDb } from './server/db.ts';
import { recipes } from './drizzle/schema.ts';

const systemRecipes = [
  {
    id: 'sys-recipe-001',
    userId: null,
    name: 'Financial Forecast',
    description: 'Predict market trends and financial outcomes using multiple economic indicators',
    type: 'SYSTEM',
    category: 'FINANCE',
    status: 'ready',
    version: 1,
    isPublic: 1,
    displayOrder: 1,
    createdFromRecipeId: null,
  },
  {
    id: 'sys-recipe-002',
    userId: null,
    name: 'Sports Predictor',
    description: 'Forecast sports match outcomes and player performance using historical data',
    type: 'SYSTEM',
    category: 'SPORTS',
    status: 'ready',
    version: 1,
    isPublic: 1,
    displayOrder: 2,
    createdFromRecipeId: null,
  },
  {
    id: 'sys-recipe-003',
    userId: null,
    name: 'Weather Analyst',
    description: 'Predict weather patterns and natural phenomena with meteorological models',
    type: 'SYSTEM',
    category: 'WEATHER',
    status: 'ready',
    version: 1,
    isPublic: 1,
    displayOrder: 3,
    createdFromRecipeId: null,
  },
  {
    id: 'sys-recipe-004',
    userId: null,
    name: 'Tech Trend Scout',
    description: 'Forecast technology trends and industry disruptions',
    type: 'SYSTEM',
    category: 'TECHNOLOGY',
    status: 'ready',
    version: 1,
    isPublic: 1,
    displayOrder: 4,
    createdFromRecipeId: null,
  },
  {
    id: 'sys-recipe-005',
    userId: null,
    name: 'Health Insights',
    description: 'Predict health outcomes and wellness trends based on available data',
    type: 'SYSTEM',
    category: 'HEALTH',
    status: 'ready',
    version: 1,
    isPublic: 1,
    displayOrder: 5,
    createdFromRecipeId: null,
  },
];

async function seed() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    for (const recipe of systemRecipes) {
      try {
        await db.insert(recipes).values(recipe);
        console.log(`✓ Seeded: ${recipe.name}`);
      } catch (err) {
        console.error(`✗ Failed to seed ${recipe.name}:`, err.message);
        throw err;
      }
    }
    console.log('✓ All SYSTEM recipes seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
