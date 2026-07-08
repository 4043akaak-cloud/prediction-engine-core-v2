import { db } from './server/db.ts';
import { recipes } from './drizzle/schema.ts';

const systemRecipes = [
  {
    id: 'sys-recipe-001',
    name: 'Financial Forecast',
    description: 'Predict market trends and financial outcomes using multiple economic indicators',
    type: 'SYSTEM',
    category: 'FINANCE',
    status: 'ACTIVE',
    version: 1,
    displayOrder: 1,
    userId: null,
  },
  {
    id: 'sys-recipe-002',
    name: 'Sports Predictor',
    description: 'Forecast sports match outcomes and player performance using historical data',
    type: 'SYSTEM',
    category: 'SPORTS',
    status: 'ACTIVE',
    version: 1,
    displayOrder: 2,
    userId: null,
  },
  {
    id: 'sys-recipe-003',
    name: 'Weather Analyst',
    description: 'Predict weather patterns and natural phenomena with meteorological models',
    type: 'SYSTEM',
    category: 'WEATHER',
    status: 'ACTIVE',
    version: 1,
    displayOrder: 3,
    userId: null,
  },
  {
    id: 'sys-recipe-004',
    name: 'Tech Trend Scout',
    description: 'Forecast technology trends and industry disruptions',
    type: 'SYSTEM',
    category: 'TECHNOLOGY',
    status: 'ACTIVE',
    version: 1,
    displayOrder: 4,
    userId: null,
  },
  {
    id: 'sys-recipe-005',
    name: 'Health Insights',
    description: 'Predict health outcomes and wellness trends based on available data',
    type: 'SYSTEM',
    category: 'HEALTH',
    status: 'ACTIVE',
    version: 1,
    displayOrder: 5,
    userId: null,
  },
];

async function seed() {
  try {
    for (const recipe of systemRecipes) {
      await db.insert(recipes).values(recipe);
      console.log(`✓ Seeded: ${recipe.name}`);
    }
    console.log('✓ All SYSTEM recipes seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
