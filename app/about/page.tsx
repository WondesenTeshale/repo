import { fetchTeamMembers, fetchConfig } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GitBranch, Link as LinkIcon, Mail } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "About — BetterDose", description: "Meet the BetterDose development team." };

export default async function AboutPage() {
  const [members, config] = await Promise.all([fetchTeamMembers(), fetchConfig()]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">The Team</span>
          <h1 className="text-display mb-4">About BetterDose</h1>
          <p className="text-subheading mb-12">
            {config.businessName} is a software development studio registered in the United Kingdom, operated by a team of engineers based in {config.address}.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <div key={member.id} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  {member.profilePhotoUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={member.profilePhotoUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-[#252d3d]" />
                    : <div className="w-12 h-12 rounded-full bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#4f8ef7] font-bold text-lg">{member.name[0]}</div>
                  }
                  <div>
                    <h2 className="text-sm font-semibold text-[#e8eaf2]">{member.name}</h2>
                    <p className="text-[10px] text-[#4f8ef7]">{member.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.skills.map(s => <span key={s} className="skill-tag text-[9px]">{s}</span>)}
                </div>
                <div className="flex flex-col gap-1.5 text-[10px] border-t border-[#1a2030] pt-3">
                  {member.uniEmail && <a href={`mailto:${member.uniEmail}`} className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7]"><Mail size={10} />{member.uniEmail}</a>}
                  {member.profEmail && <a href={`mailto:${member.profEmail}`} className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7]"><Mail size={10} />{member.profEmail}</a>}
                  {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7]"><GitBranch size={10} />{member.github.replace("https://", "")}</a>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7]"><LinkIcon size={10} />{member.linkedin.replace("https://", "")}</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
