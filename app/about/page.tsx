import { fetchTeamMembers, fetchConfig } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { GitBranch, Link as LinkIcon, Mail, MapPin, Users } from "lucide-react";

export const revalidate = 60;
export const metadata = { title: "About — BetterDose", description: "Meet the BetterDose development team." };

export default async function AboutPage() {
  const [members, config] = await Promise.all([fetchTeamMembers(), fetchConfig()]);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ─── HERO BANNER ─────────────────────────────── */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        <div className="relative h-72 md:h-96 w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117]/60 via-transparent to-[#0f1117] z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1117]/60 via-transparent to-[#0f1117]/60 z-10" />
          <Image src="/images/about-hero.png" alt="BetterDose team" fill className="object-cover object-center" priority />
          {/* Overlay content */}
          <div className="absolute bottom-10 left-6 md:left-12 z-20 max-w-5xl">
            <span className="section-label">The Team</span>
            <h1 className="text-display mt-1">About BetterDose</h1>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Intro strip */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 py-10 border-b border-[#252d3d] mb-12">
            <p className="text-subheading flex-1">
              {config.businessName} is a software development studio registered in the United Kingdom, operated by a team of engineers based in {config.address}.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#556080] shrink-0">
              <MapPin size={13} />
              <span>{config.address}</span>
            </div>
          </div>

          {/* Team section label */}
          <div className="flex items-center gap-3 mb-8">
            <Users size={16} className="text-[#4f8ef7]" />
            <span className="text-sm font-semibold text-[#e8eaf2]">Our People</span>
            <span className="text-xs text-[#556080]">— {members.length} team members</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <div key={member.id} className="card p-6 group hover:border-[#4f8ef7]/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {member.profilePhotoUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={member.profilePhotoUrl} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#4f8ef7]/30 group-hover:border-[#4f8ef7]/60 transition-colors" />
                    : <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4f8ef7]/20 to-[#818cf8]/20 border-2 border-[#4f8ef7]/30 flex items-center justify-center text-[#4f8ef7] font-bold text-xl">{member.name[0]}</div>
                  }
                  <div>
                    <h2 className="text-sm font-semibold text-[#e8eaf2]">{member.name}</h2>
                    <p className="text-[10px] text-[#4f8ef7] font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.skills.map(s => <span key={s} className="skill-tag text-[9px]">{s}</span>)}
                </div>
                <div className="flex flex-col gap-1.5 text-[10px] border-t border-[#1a2030] pt-3">
                  {member.uniEmail && <a href={`mailto:${member.uniEmail}`} className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7] transition-colors"><Mail size={10} />{member.uniEmail}</a>}
                  {member.profEmail && <a href={`mailto:${member.profEmail}`} className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7] transition-colors"><Mail size={10} />{member.profEmail}</a>}
                  {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7] transition-colors"><GitBranch size={10} />{member.github.replace("https://", "")}</a>}
                  {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#556080] hover:text-[#4f8ef7] transition-colors"><LinkIcon size={10} />{member.linkedin.replace("https://", "")}</a>}
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
