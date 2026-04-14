import { ShieldCheck, Utensils, Home, Brain } from 'lucide-react';

export const INFO_TABS = {
  PELIGROS: {
    id: 'peligros', label: 'Seguridad Vital', icon: ShieldCheck, color: 'bg-rose-500',
    content: [
      { title: "El Asesino Silencioso: Teflón", desc: "Sartenes y planchas antiadherentes sobrecalentadas liberan gases inodoros que matan al ave en minutos.", severity: "CRITICO" },
      { title: "Metales Pesados", desc: "Zinc y Plomo en cascabeles baratos, bisutería o jaulas oxidadas. Causan fallo neurológico.", severity: "ALTO" },
      { title: "Aguacate", desc: "Contiene persina, una toxina cardíaca letal para psitácidas. Jamás ofrecer ni un trozo.", severity: "LETAL" },
      { title: "Vapores Tóxicos", desc: "Aerosoles, perfumes, velas aromáticas, humo de tabaco e inciensos. Sus pulmones son hipersensibles.", severity: "ALTO" },
      { title: "Plantas Comunes", desc: "Adelfa, Lirio, Dieffenbachia y Potos son venenosas si las pican.", severity: "MEDIO" },
      { title: "Nidos de Tela", desc: "Las fibras se deshilachan y se enredan en patas (amputación) o buche (impactación).", severity: "ALTO" },
    ]
  },
  DIETA: {
    id: 'dieta', label: 'Nutrición Pro', icon: Utensils, color: 'bg-emerald-500',
    stats: [
      { label: "Pienso Extrusionado", val: "45%", desc: "Base de la dieta (Nutribird, Psittacus)" },
      { label: "Frescos Diarios", val: "40%", desc: "Verduras de hoja, pimiento, brocoli" },
      { label: "Semillas", val: "10%", desc: "Solo como premio o complemento" },
      { label: "Fruta", val: "5%", desc: "Por su alto contenido en azúcar" }
    ],
    list: ["Pimiento Rojo/Verde", "Espinacas", "Zanahoria", "Calabacín", "Brócoli", "Manzana (sin pepas)", "Huevo duro (con cáscara)"]
  },
  HABITAT: {
    id: 'habitat', label: 'Jaula y Sueño', icon: Home, color: 'bg-indigo-500',
    tips: [
      { t: "La Regla del Vuelo", d: "La jaula debe ser más ancha que alta. Mínimo 60cm de largo para que puedan aletear." },
      { t: "12 Horas de Oscuridad", d: "Necesitan dormir 12h en oscuridad total y silencio para no tener problemas hormonales." },
      { t: "Perchas Naturales", d: "Usa ramas de árboles frutales de diferentes grosores. El plástico causa pododermatitis." },
      { t: "Ubicación", d: "Sala social, pegada a una pared (seguridad), lejos de cocina y corrientes de aire." }
    ]
  },
  LENGUAJE: {
    id: 'lenguaje', label: 'Diccionario Ave', icon: Brain, color: 'bg-amber-500',
    actions: [
      { act: "Rechinar el pico", mean: "Estoy relajado y listo para dormir.", type: "good" },
      { act: "Regurgitar comida", mean: "Te quiero alimentar (Vínculo máximo).", type: "love" },
      { act: "Alas abiertas (Corazón)", mean: "Territorialidad o mucho calor.", type: "warn" },
      { act: "Pupilas contrayéndose", mean: "Excitación extrema o agresividad inminente.", type: "warn" },
      { act: "Esponjarse", mean: "Si es breve: relax. Si es constante: enfermedad.", type: "alert" }
    ]
  }
};

export const VIDEOS = [
  { id: 1, title: "Guía Definitiva de Alimentación", yt: "CO7orv0PCjw", dur: "12:45", tag: "Esencial" },
  { id: 2, title: "Errores de Principiante", yt: "AP1xhrlhSbU", dur: "15:20", tag: "Crítico" },
  { id: 3, title: "Adiestramiento Básico", yt: "cJwKwo95qR0", dur: "10:12", tag: "Trucos" },
  { id: 4, title: "Lenguaje Corporal", yt: "qqPfrgDM7qY", dur: "14:05", tag: "Conducta" }
];