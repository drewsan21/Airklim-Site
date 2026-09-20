import { useState } from 'react';

// ===== TESTIMONIAL TYPE =====
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image: string;
  product?: string;
  location: string;
  date: string;
}

// ===== TESTIMONIALS DATA =====
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    role: 'Installatore Certificato',
    company: 'ClimaTech Solutions',
    content: 'Collaboro con AIRKLIM da 5 anni e posso confermare la loro professionalità. Prodotti di alta qualità, supporto tecnico eccellente e prezzi competitivi. Il programma PRO Partner Panasonic mi ha permesso di crescere professionalmente.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic Etherea Z35',
    location: 'Palermo',
    date: '2025-12-15'
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Proprietaria di Casa',
    content: 'Ho acquistato un climatizzatore Panasonic Etherea per la mia casa e sono rimasta entusiasta. L\'installazione è stata rapida e professionale. Il sistema nanoe™ X ha migliorato la qualità dell\'aria, soprattutto per mia figlia allergica.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic Etherea Z25',
    location: 'Catania',
    date: '2025-11-20'
  },
  {
    id: '3',
    name: 'Antonio Ferraro',
    role: 'Titolare Ristorante',
    company: 'Ristorante La Terrazza',
    content: 'Avevamo bisogno di un sistema di climatizzazione per il nostro ristorante. AIRKLIM ci ha consigliato il sistema VRF Panasonic ECOi e il risultato è perfetto. I clienti apprezzano il comfort e noi il risparmio energetico.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic ECOi VRF',
    location: 'Messina',
    date: '2025-10-08'
  },
  {
    id: '4',
    name: 'Francesca Marino',
    role: 'Architetto',
    content: 'Come professionista, apprezzo la competenza tecnica di AIRKLIM. Mi hanno supportato nella scelta dei climatizzatori per un progetto residenziale di lusso. Prodotti affidabili e servizio impeccabile.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic Etherea XZ',
    location: 'Siracusa',
    date: '2025-09-25'
  },
  {
    id: '5',
    name: 'Salvatore Greco',
    role: 'Installatore',
    company: 'ThermoSystem Srl',
    content: 'AIRKLIM è il mio fornitore di riferimento per i climatizzatori TCL. Rapporto qualità-prezzo eccezionale e assistenza tecnica sempre disponibile. Consiglio vivamente ai colleghi installatori.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    product: 'TCL BreezeIN 12000',
    location: 'Trapani',
    date: '2025-08-12'
  },
  {
    id: '6',
    name: 'Laura Lombardi',
    role: 'Proprietaria Hotel',
    company: 'Hotel Belvedere',
    content: 'Abbiamo installato 40 climatizzatori Panasonic nelle nostre camere. I clienti sono soddisfatti del silenzio e del comfort. Il consumo energetico è inferiore alle aspettative. Ottimo investimento.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic Etherea Z35 (40 unità)',
    location: 'Agrigento',
    date: '2025-07-30'
  },
  {
    id: '7',
    name: 'Roberto Esposito',
    role: 'Proprietario di Casa',
    content: 'Ho sfruttato il Conto Termico 3.0 per installare una pompa di calore Panasonic Aquarea. AIRKLIM mi ha seguito in tutta la pratica burocratica. Risparmio del 65% sulla spesa e bolletta ridotta del 40%.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic Aquarea 9kW',
    location: 'Ragusa',
    date: '2025-06-18'
  },
  {
    id: '8',
    name: 'Chiara Romano',
    role: 'Direttrice Ufficio',
    company: 'Studio Legale Romano & Associati',
    content: 'Il sistema di climatizzazione installato da AIRKLIM nel nostro studio legale è perfetto. Silenzioso, efficiente e con un design che si integra con l\'arredamento. Assistenza post-vendita eccellente.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    product: 'Panasonic ECOi VRF',
    location: 'Caltanissetta',
    date: '2025-05-22'
  }
];

// ===== STATS DATA =====
const stats = [
  { value: '500+', label: 'Clienti Soddisfatti' },
  { value: '4.9/5', label: 'Valutazione Media' },
  { value: '20+', label: 'Anni di Esperienza' },
  { value: '98%', label: 'Tasso di Soddisfazione' }
];

// ===== TESTIMONIALS SECTION COMPONENT =====
export function TestimonialsSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'Tutti' },
    { id: 'privati', label: 'Privati' },
    { id: 'professionisti', label: 'Professionisti' },
    { id: 'aziende', label: 'Aziende' }
  ];

  const filteredTestimonials = testimonials.filter(t => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'privati') return !t.company;
    if (selectedFilter === 'professionisti') return t.role === 'Installatore Certificato' || t.role === 'Installatore' || t.role === 'Architetto';
    if (selectedFilter === 'aziende') return t.company && (t.role === 'Titolare Ristorante' || t.role === 'Proprietaria Hotel' || t.role === 'Direttrice Ufficio');
    return true;
  });

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Testimonianze</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Cosa Dicono i Nostri Clienti<br />
            <span className="text-gradient">Storie di Successo Reali</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Oltre 500 clienti soddisfatti in tutta la Sicilia. Scopri le loro esperienze con AIRKLIM.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 text-center">
              <div className="text-4xl font-bold text-sky-400 mb-2">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 hover:border-sky-500/30 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-white/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-white/70 mb-6 leading-relaxed line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Product */}
              {testimonial.product && (
                <div className="mb-4 px-3 py-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                  <div className="text-xs text-sky-400 mb-1">Prodotto Installato</div>
                  <div className="text-sm text-white font-medium">{testimonial.product}</div>
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                  {testimonial.company && (
                    <div className="text-xs text-sky-400">{testimonial.company}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/40">{testimonial.location}</div>
                  <div className="text-xs text-white/40">
                    {new Date(testimonial.date).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/50 mb-4">Vuoi condividere la tua esperienza?</p>
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            Lascia una Recensione
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
