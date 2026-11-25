/**
 * ============================================================================
 * ARROWSTACK FULL STACK DEVELOPMENT INTERNSHIP — PROJECT 1 (SECTION 17 EXTENSION)
 * Script: scripts/automate_ops.js
 * Description: Standalone CLI Automation Runner for Warehouse Operations
 * Can be scheduled via OS Cron (Linux/macOS) or Windows Task Scheduler.
 * Usage: node scripts/automate_ops.js
 * ============================================================================
 */

const automationService = require('../backend/src/modules/automation/automation.service');

async function main() {
  console.log('====================================================');
  console.log(' ⚙️  B2B OrderHub Automated Operations Runner');
  console.log('====================================================');
  console.log('>>> Triggering automated replenishment and invoice checks...');

  const result = await automationService.runAutomatedOps({
    name: 'Scheduled Cron Daemon',
    role: 'admin'
  });

  console.log('\n--- AUTOMATION EXECUTION RESULTS ---');
  console.log(`⏱️  Execution Duration : ${result.executionDurationMs} ms`);
  console.log(`📦 Restocked SKUs     : ${result.summary.restockedCount}`);
  if (result.summary.restockedItems.length > 0) {
    result.summary.restockedItems.forEach(item => {
      console.log(`   - ${item.sku}: ${item.name} (${item.previousStock} -> ${item.newStock} units, +${item.added})`);
    });
  }

  console.log(`⚠️  Overdue Invoices  : ${result.summary.escalatedInvoicesCount}`);
  if (result.summary.escalatedInvoices.length > 0) {
    result.summary.escalatedInvoices.forEach(inv => {
      console.log(`   - ${inv.id}: ${inv.company} ($${inv.amount.toFixed(2)}, Due: ${inv.due})`);
    });
  }

  console.log('\n--- PRODUCTIVITY & QUALITY BENEFIT ---');
  console.log(`⏳ Manual Time Needed : ${result.productivityBenefit.manualTimePerDayMin} minutes/day`);
  console.log(`🚀 Automated Runtime   : ${result.productivityBenefit.automatedTimeSec} seconds`);
  console.log(`📈 Time Saved Ratio   : ${result.productivityBenefit.timeSavedPercent}`);
  console.log(`🛡️  Quality Benefit    : ${result.productivityBenefit.errorReductionPercent}`);
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('Automation runner error:', err);
  process.exit(1);
});
