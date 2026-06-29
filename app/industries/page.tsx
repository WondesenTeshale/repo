import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Rocket, GraduationCap, Heart, Cloud, ShoppingCart, CreditCard, Stethoscope, BookOpen, FlaskConical } from "lucide-react";

export const metadata = {
  title: "Industries We Serve — BetterDose",
  description: "BetterDose delivers software solutions across a wide range of industries including Startups, FinTech, Healthcare, Education, and more.",
};

const industries = [
  {
    icon: Rocket,
    name: "Startups",
    description: "We help early-stage companies move fast with lean MVPs, scalable backend APIs, and clean frontends that impress investors and early users.",
    examples: ["MVP Development", "Rapid Prototyping", "Product Architecture", "Go-to-Market Tech"],
  },
  {
    icon: Building2,
    name: "Small Businesses",
    description: "From local service providers to growing enterprises, we build the digital tools — websites, dashboards, and automation — that help small businesses compete.",
    examples: ["Business Websites", "CRM Systems", "Admin Dashboards", "Booking Platforms"],
  },
  {
    icon: GraduationCap,
    name: "Universities",
    description: "Academic institutions trust us to build student platforms, service marketplaces, and internal tools that modernize campus operations.",
    examples: ["Student Portals", "Service Marketplaces", "Academic Management", "Research Tools"],
  },
  {
    icon: Heart,
    name: "NGOs",
    description: "We support non-profit organizations with affordable, impact-driven digital solutions that streamline outreach, reporting, and community engagement.",
    examples: ["Donation Platforms", "Volunteer Management", "Impact Dashboards", "Community Apps"],
  },
  {
    icon: Cloud,
    name: "SaaS Companies",
    description: "We integrate into SaaS product teams as development partners — building features, designing APIs, and ensuring QA quality for cloud-delivered software.",
    examples: ["Feature Development", "API Design", "Multi-Tenant Architecture", "QA & Testing"],
  },
  {
    icon: ShoppingCart,
    name: "E-commerce",
    description: "End-to-end e-commerce platforms with inventory management, payment integrations, and high-performance storefronts designed to convert.",
    examples: ["Online Stores", "Payment Gateways", "Inventory Systems", "Analytics Dashboards"],
  },
  {
    icon: CreditCard,
    name: "FinTech",
    description: "Secure, compliant financial software — from digital wallets and trading platforms to reporting dashboards and transaction management systems.",
    examples: ["Digital Wallets", "Trading Platforms", "Payment Processing", "Financial Dashboards"],
  },
  {
    icon: Stethoscope,
    name: "Healthcare",
    description: "Patient-centric applications and clinic management systems built with a focus on data privacy, compliance, and reliable uptime.",
    examples: ["Patient Portals", "Appointment Systems", "Health Records", "Telemedicine Apps"],
  },
  {
    icon: BookOpen,
    name: "Education",
    description: "Interactive learning platforms, content management systems, and student engagement tools that make education more accessible and effective.",
    examples: ["E-learning Platforms", "Course Management", "Student Dashboards", "Content Delivery"],
  },
  {
    icon: FlaskConical,
    name: "Testing Platforms",
    description: "We partner with QA and beta testing platforms as experienced testers — providing structured feedback, bug reports, and usability insights.",
    examples: ["Beta Testing", "Usability Studies", "Bug Reporting", "AI Product Evaluation"],
  },
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <span className="section-label">Sectors</span>
            <h1 className="text-display mb-4">Industries We Serve</h1>
            <p className="text-subheading max-w-2xl">
              BetterDose delivers tailored software solutions across a wide range of sectors — from early-stage startups to established institutions. Wherever digital product quality matters, we are there.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="card p-6 group hover:border-[#4f8ef7]/30 transition-all hover:-translate-y-0.5 duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center group-hover:bg-[#4f8ef7]/20 transition-colors">
                      <Icon size={16} className="text-[#4f8ef7]" />
                    </div>
                    <h2 className="text-sm font-semibold text-[#e8eaf2]">{industry.name}</h2>
                  </div>
                  <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{industry.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.examples.map((ex) => (
                      <span key={ex} className="skill-tag text-[9px] py-0.5 px-1.5">{ex}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 card p-8 text-center">
            <h2 className="text-base font-semibold text-[#e8eaf2] mb-2">Don&apos;t see your industry?</h2>
            <p className="text-sm text-[#8b92a9] mb-5">We work with any business where software quality matters. Get in touch and let us discuss how we can help.</p>
            <a href="/contact" className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
              Start a Conversation
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
