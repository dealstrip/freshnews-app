const { execSync } = require('child_process');

const PROJECT_NAME = 'freshnews-frontend';

console.log(`Fetching deployments for ${PROJECT_NAME}...`);
try {
  let moreDeployments = true;
  while (moreDeployments) {
    // Get list of deployments
    const output = execSync(`npx wrangler pages deployment list --project-name ${PROJECT_NAME} --json`).toString();
    const deployments = JSON.parse(output);

    // Filter out the active production deployment which cannot be deleted this way
    const toDelete = deployments.filter(dep => dep.Environment !== 'Production' || !dep.Aliases || dep.Aliases.length === 0);

    if (toDelete.length <= 1) { // Leave the very last production one or if empty
      console.log("No more deployments to delete.");
      moreDeployments = false;
      break;
    }

    console.log(`Found ${toDelete.length} deployments in this batch. Starting deletion...`);

    // Loop through and delete each one
    for (const dep of toDelete) {
      console.log(`Deleting deployment ${dep.Id}...`);
      try {
        execSync(`npx wrangler pages deployment delete ${dep.Id} --project-name ${PROJECT_NAME} --force`, { stdio: 'pipe' });
      } catch (err) {
        console.log(`Could not delete ${dep.Id} (It might be the active production deployment).`);
      }
    }
  }

  console.log("\nDone! You can now go to the Cloudflare Dashboard, HARD REFRESH the page (Ctrl+F5), and delete the project.");
} catch (error) {
  console.error("Error:", error.message);
  console.log("\nDid you remember to run 'npx wrangler login' first?");
}
