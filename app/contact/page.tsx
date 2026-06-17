import { fetchConfig } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact — BetterDose", description: "Get in touch with the BetterDose software development team." };

export default async function ContactPage() {
  const config = await fetchConfig();
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="section-label">Get In Touch</span>
          <h1 className="text-display mb-4">Contact Us</h1>
          <p className="text-subheading mb-12">Reach out to discuss a project, request a quote, or ask about our services.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 space-y-6">
              <h2 className="text-sm font-semibold text-[#e8eaf2]">Direct Contact</h2>
              {[
                { icon: <Mail size={15} />, label: "Email", value: config.email, href: `mailto:${config.email}` },
                { icon: <Phone size={15} />, label: "Phone", value: config.phone, href: `tel:${config.phone}` },
                { icon: <MapPin size={15} />, label: "Location", value: config.address, href: undefined },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#4f8ef7]">{item.icon}</div>
                  <div>
                    <p className="text-[10px] text-[#556080]">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-sm text-[#e8eaf2] hover:text-[#4f8ef7] transition-colors">{item.value}</a>
                      : <p className="text-sm text-[#e8eaf2]">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-8 space-y-4">
              <h2 className="text-sm font-semibold text-[#e8eaf2]">Online Profiles</h2>
              {[
                { label: "GitHub — Nebiyu", url: config.githubNebiyu },
                { label: "GitHub — Eyob", url: config.githubEyob },
                { label: "LinkedIn — Nebiyu", url: config.linkedInNebiyu },
                { label: "LinkedIn — Eyob", url: config.linkedInEyob },
              ].filter(l => l.url).map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 border-b border-[#1a2030] text-sm text-[#8b92a9] hover:text-[#4f8ef7] transition-colors">
                  {link.label} <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
