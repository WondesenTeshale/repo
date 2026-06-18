"use client";

import { motion } from "framer-motion";
import { Terminal, Database, Cloud, Code2, TestTube2, Blocks } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const techCategories = [
  {
    title: "Languages",
    icon: Terminal,
    items: [
      { name: "TypeScript", desc: "Primary language for frontend and Node.js backend development." },
      { name: "JavaScript", desc: "ES6+, heavily used in all web projects and browser automation." },
      { name: "Python", desc: "Used for automation, data analysis, scripting, and machine learning pipelines." },
      { name: "SQL", desc: "Core language for database queries and management." },
      { name: "PHP", desc: "Used for WordPress, legacy system debugging, and backend scripts." },
      { name: "Bash / Shell", desc: "System scripting and server automation." }
    ]
  },
  {
    title: "Frameworks & Libraries",
    icon: Blocks,
    items: [
      { name: "React", desc: "Primary library for building dynamic user interfaces." },
      { name: "Next.js", desc: "React framework for production-grade, SSR/SSG applications." },
      { name: "Node.js & Express", desc: "Backend API and microservices framework." },
      { name: "Tailwind CSS", desc: "Utility-first styling framework for rapid UI development." },
      { name: "Framer Motion", desc: "Animation library for fluid, production-ready React UI interactions." },
      { name: "WordPress", desc: "CMS framework for content-heavy sites and custom theme/plugin development." }
    ]
  },
  {
    title: "Databases",
    icon: Database,
    items: [
      { name: "PostgreSQL", desc: "Primary relational database for robust, scalable applications." },
      { name: "MySQL", desc: "Relational database used often with WordPress and PHP stacks." },
      { name: "Supabase", desc: "Backend-as-a-service providing Postgres, Auth, and Storage." },
      { name: "Redis", desc: "In-memory caching and message brokering." },
      { name: "MongoDB", desc: "NoSQL document database for flexible schema requirements." }
    ]
  },
  {
    title: "Testing Tools",
    icon: TestTube2,
    items: [
      { name: "Jest", desc: "JavaScript testing framework for unit and integration testing." },
      { name: "Cypress", desc: "End-to-end testing framework for web applications." },
      { name: "Playwright", desc: "Browser automation and end-to-end testing across all modern browsers." },
      { name: "Postman", desc: "API development and manual/automated endpoint testing." },
      { name: "Selenium", desc: "Web browser automation for testing and scraping." }
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    items: [
      { name: "Vercel", desc: "Primary deployment platform for Next.js frontend applications." },
      { name: "AWS", desc: "Cloud infrastructure (EC2, S3, RDS) for scalable deployments." },
      { name: "Docker", desc: "Containerization for consistent development and deployment environments." },
      { name: "GitHub Actions", desc: "CI/CD pipelines for automated testing and deployment." },
      { name: "Linux", desc: "Server administration and environment configuration." }
    ]
  }
];

export default function TechnologiesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-36 pb-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl mb-20"
          >
            <span className="section-label mb-4">Tech Stack</span>
            <h1 className="text-display mb-6">Technologies We Use</h1>
            <p className="text-subheading mb-8 text-[#8b92a9] leading-relaxed">
              We leverage modern, industry-standard technologies to build scalable software, perform rigorous testing, and deploy robust applications. Here is an overview of the tools, languages, and frameworks we use daily.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="space-y-16">
            {techCategories.map((category, idx) => (
              <motion.div 
                key={category.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-6 border-b border-[#252d3d] pb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7]">
                    <category.icon size={16} />
                  </div>
                  <h2 className="text-lg font-semibold text-[#e8eaf2]">{category.title}</h2>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {category.items.map(item => (
                    <div key={item.name} className="card p-5 bg-[#121620]/50 hover:bg-[#151922] transition-colors border-[#252d3d]/60">
                      <h3 className="text-sm font-semibold text-[#4f8ef7] mb-1.5 flex items-center gap-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#8b92a9] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
