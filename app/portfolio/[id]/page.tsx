import { fetchProjects, fetchProjectById } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, GitBranch, ExternalLink, CheckCircle, Shield, Calendar, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await fetchProjectById(params.id);
  if (!project) notFound();

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-xs text-[#556080] hover:text-[#4f8ef7] mb-8 transition-colors">
            <ArrowLeft size={13} /> Back to Portfolio
          </Link>

          <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <span className="section-label">{project.category}</span>
              <h1 className="text-display">{project.name}</h1>
              <p className="text-xs text-[#556080] flex items-center gap-2 mt-2">
                <Calendar size={11} />
                {project.projectStartDate} {project.projectEndDate ? `to ${project.projectEndDate}` : "(Ongoing)"}
                <span>·</span>
                <span className="badge badge-blue">{project.status}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {project.githubRepository && (
                <a href={project.githubRepository} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-xs py-1.5 px-3">
                  <GitBranch size={13} /> GitHub
                </a>
              )}
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-xs py-1.5 px-3">
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">

              <div className="card p-6">
                <h2 className="text-sm font-semibold text-[#e8eaf2] mb-3">What problem was solved</h2>
                <p className="text-sm text-[#8b92a9] leading-relaxed mb-4">{project.description}</p>
                {project.notes && <p className="text-xs text-[#556080] italic border-t border-[#1a2030] pt-2">Note: {project.notes}</p>}
              </div>

              {project.features.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Key Features</h3>
                  <ul className="space-y-3 text-sm text-[#8b92a9]">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle size={14} className="text-[#4f8ef7] mt-1 shrink-0" /><span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.projectOutcome && (
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Project Outcome</h3>
                  <p className="text-sm text-[#8b92a9] leading-relaxed">{project.projectOutcome}</p>
                </div>
              )}

              {project.projectChallenges && (
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Challenges</h3>
                  <p className="text-sm text-[#8b92a9] leading-relaxed">{project.projectChallenges}</p>
                </div>
              )}

              {project.screenshots.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#e8eaf2] mb-4">Screenshots</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.screenshots.map((src, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-[#252d3d]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${project.name} screenshot ${i + 1}`} className="w-full h-auto object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.teamMembers.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3 flex items-center gap-2"><Users size={14} /> Team members</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.teamMembers.map((m, i) => <span key={i} className="skill-tag text-xs font-semibold text-[#e8eaf2]">{m}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#556080] mb-3.5">Technologies Used</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologiesUsed.map(t => <span key={t} className="skill-tag text-xs">{t}</span>)}
                </div>
              </div>

              {project.technicalArchitecture && (
                <div className="card p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#556080] mb-3">Technical Architecture</h3>
                  <p className="text-xs text-[#8b92a9] leading-relaxed">{project.technicalArchitecture}</p>
                </div>
              )}

              {project.documentationLinks.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#556080] mb-3">Documentation</h3>
                  <ul className="space-y-2 text-xs">
                    {project.documentationLinks.map((doc, i) => (
                      <li key={i}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[#4f8ef7] hover:underline flex items-center gap-1">
                          {doc.label} <ExternalLink size={10} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-start gap-3">
                <Shield size={16} className="text-[#4f8ef7] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[#e8eaf2]">Project Integrity</h4>
                  <p className="text-[10px] text-[#556080] leading-relaxed mt-1">
                    All source code and architectural documentation for this project are maintained under version control. Technical walkthroughs are available upon formal request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
