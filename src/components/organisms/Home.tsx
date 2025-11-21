import { Settings, ShieldCheck, Users2 } from "lucide-react";

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all">
      <h4 className="text-xl font-semibold mb-6 text-blue-900 flex gap-2 items-center">{icon}{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
  
  export default function Home() {
    return (
    <div className="min-h-screen text-gray-900 mt-16">
      <main className="px-6 md:px-20 py-12">
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900">
            Gestión Inteligente para el Futuro del Aprendizaje
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            SENAGEST es el sistema integral del SENA que optimiza procesos, mejora la eficiencia institucional
            y fortalece la calidad educativa con herramientas de gestión avanzadas.
          </p>
        </section>

        <section className="mt-20 grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Settings className="w-10 h-10" />} 
            title="Gestión Centralizada"
            description="Administra todas las áreas del SENA desde una plataforma unificada."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-10 h-10" />} 
            title="Seguridad y Confianza"
            description="Cumple con los más altos estándares de seguridad institucional."
          />
          <FeatureCard 
            icon={<Users2 className="w-10 h-10" />} 
            title="Enfocado en el Usuario"
            description="Diseñado pensando en los instructores, aprendices y personal administrativo."
          />
        </section>

      </main>

      <footer className="mt-20 p-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SENAGEST - Servicio Nacional de Aprendizaje (SENA)
      </footer>
    </div>
  );
  }
  