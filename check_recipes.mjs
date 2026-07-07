import { getDb } from './server/db.ts';
import { recipes } from './drizzle/schema.ts';

const db = await getDb();
const allRecipes = await db.select().from(recipes);
console.log('All recipes in database:');
console.log(JSON.stringify(allRecipes, null, 2));
