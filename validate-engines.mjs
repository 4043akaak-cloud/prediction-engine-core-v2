#!/usr/bin/env node

/**
 * Engine Garage Validation Script
 * Tests all 63 engines for:
 * - Correct slug generation
 * - No duplicate slugs
 * - Valid page registration
 * - Successful API response
 */

const API_BASE = 'http://localhost:3000/api/trpc';
const PREVIEW_BASE = 'http://localhost:3000/engines';

async function validateEngines() {
  console.log('🔍 Starting Engine Garage Validation...\n');

  try {
    // Fetch all engines from API
    console.log('📡 Fetching engines from API...');
    const response = await fetch(`${API_BASE}/engineLibrary.listEngines`);
    const data = await response.json();

    if (!data.result || !data.result.data || !data.result.data.json) {
      console.error('❌ Failed to fetch engines from API');
      console.error('Response:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    const engines = data.result.data.json;
    console.log(`✅ Retrieved ${engines.length} engines from API\n`);

    // Validation checks
    const slugs = new Set();
    const duplicates = [];
    const missingRoutes = [];
    const validEngines = [];
    let successCount = 0;
    let failCount = 0;

    // Check for duplicate slugs
    for (const engine of engines) {
      if (slugs.has(engine.id)) {
        duplicates.push(engine.id);
      }
      slugs.add(engine.id);
    }

    // Test each engine route
    console.log('🧪 Testing engine detail pages...\n');

    for (let i = 0; i < engines.length; i++) {
      const engine = engines[i];
      const url = `${PREVIEW_BASE}/${engine.id}`;

      try {
        const pageResponse = await fetch(url, {
          redirect: 'follow',
        });

        if (pageResponse.status === 404) {
          missingRoutes.push({
            id: engine.id,
            name: engine.name,
            status: 404,
          });
          console.log(`❌ [${i + 1}/${engines.length}] ${engine.name} (${engine.id}) - 404 Not Found`);
          failCount++;
        } else if (pageResponse.status === 200) {
          validEngines.push(engine);
          console.log(`✅ [${i + 1}/${engines.length}] ${engine.name} (${engine.id})`);
          successCount++;
        } else {
          console.log(`⚠️  [${i + 1}/${engines.length}] ${engine.name} (${engine.id}) - Status ${pageResponse.status}`);
          failCount++;
        }
      } catch (error) {
        console.log(`❌ [${i + 1}/${engines.length}] ${engine.name} (${engine.id}) - Error: ${error.message}`);
        missingRoutes.push({
          id: engine.id,
          name: engine.name,
          error: error.message,
        });
        failCount++;
      }
    }

    // Report results
    console.log('\n' + '='.repeat(80));
    console.log('📋 VALIDATION REPORT\n');

    console.log(`✅ Successful: ${successCount}/${engines.length}`);
    console.log(`❌ Failed: ${failCount}/${engines.length}\n`);

    if (duplicates.length > 0) {
      console.log(`⚠️  Duplicate Slugs Found: ${duplicates.length}`);
      duplicates.forEach(slug => console.log(`   - ${slug}`));
      console.log();
    }

    if (missingRoutes.length > 0) {
      console.log(`❌ Missing/Invalid Routes: ${missingRoutes.length}`);
      missingRoutes.forEach(route => {
        console.log(`   - ${route.id} (${route.name})`);
        if (route.error) console.log(`     Error: ${route.error}`);
      });
      console.log();
    }

    // Summary
    console.log('='.repeat(80));
    if (failCount === 0 && duplicates.length === 0) {
      console.log('\n✅ ALL VALIDATIONS PASSED');
      console.log(`   • All ${engines.length} engines have valid routes`);
      console.log('   • No duplicate slugs detected');
      console.log('   • All engine pages are accessible\n');
      process.exit(0);
    } else {
      console.log('\n❌ VALIDATION FAILED');
      if (duplicates.length > 0) {
        console.log(`   • ${duplicates.length} duplicate slug(s) found`);
      }
      if (missingRoutes.length > 0) {
        console.log(`   • ${missingRoutes.length} missing/invalid route(s)`);
      }
      console.log();
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Validation script error:', error);
    process.exit(1);
  }
}

validateEngines();
