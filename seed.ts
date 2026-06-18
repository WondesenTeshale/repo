import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

const connectionString = "postgres://postgres.ejltkdlfvvjqhkhusclm:8xg9mODSZnpIsepy@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

async function fix() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log("Connected to PostgreSQL");
  
  try {
    await client.query(`
      ALTER TABLE projects 
      DROP CONSTRAINT projects_category_check,
      ADD CONSTRAINT projects_category_check CHECK (category IN ('completed', 'ongoing', 'university', 'qa-testing'));
    `);
    console.log("Successfully updated constraint.");
  } catch (e) {
    console.error("Failed to update constraint:", (e as Error).message);
  }

  const projectQuery = `
    INSERT INTO projects (
      id, name, category, description, technologies_used, screenshots, github_repository, live_demo, team_members, project_start_date, project_end_date, status, features, technical_architecture, documentation_links, client_type, project_outcome, project_challenges, notes, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
  `;

  try {
    await client.query(projectQuery, [
      uuidv4(), "Legacy System PHP Debugging", "qa-testing", "Extensive quality assurance, debugging, and regression testing for a legacy PHP application.", ["PHP", "MySQL", "Selenium", "Postman"], [], "", "", ["Nebiyu Muluadam", "Abel Tadesse"], "2024-01-01", "2024-02-15", "Completed", ["Functional testing", "Bug discovery", "Regression testing", "Performance Profiling"], "LAMP stack legacy application requiring extensive manual and automated testing.", "[]", "E-Commerce Business", "Resolved 50+ critical bugs and improved system stability.", "Testing undocumented legacy code logic.", "Project Type: QA Testing\nPlatform: Web Application\nResponsibilities: Functional testing, Bug discovery, Regression testing", new Date().toISOString()
    ]);
    console.log("Successfully inserted Legacy System PHP Debugging");
  } catch (e) {
    console.error("Failed to insert project:", (e as Error).message);
  }

  await client.end();
}

fix();
