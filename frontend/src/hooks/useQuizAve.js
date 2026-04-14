import { useState, useMemo } from 'react';
import { Zap, Palette, GraduationCap } from 'lucide-react';

export const useQuizAve = (avesDisponibles = []) => {
  const [fase, setFase] = useState('intro');
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [aveGanadora, setAveGanadora] = useState(null); 
  const [esAlternativa, setEsAlternativa] = useState(false);

  const preguntas = [
    {
      id: 'energia',
      pregunta: "¿Qué esperas de tu nuevo amigo?",
      icono: <Zap size={24} className="text-yellow-500" />,
      opciones: [
        { label: "Compañía y tranquilidad", val: "tranquilo", icon: "🍃", desc: "Disfrutar momentos de calma juntos" },
        { label: "Juego y diversión", val: "activo", icon: "⚡", desc: "Reírnos con sus ocurrencias" }
      ]
    },
    {
      id: 'color',
      pregunta: "¿Qué colores te atraen más?",
      icono: <Palette size={24} className="text-purple-500" />,
      opciones: [
        { label: "Verdes / Naturaleza", val: "verde", icon: "🌿", desc: "El color clásico de la selva" },
        { label: "Azules / Cielo", val: "azul", icon: "💎", desc: "Tonos turquesas y brillantes" }
      ]
    },
    {
      id: 'experiencia',
      pregunta: "¿Es tu primera vez criando?",
      icono: <GraduationCap size={24} className="text-blue-500" />,
      opciones: [
        { label: "Sí, soy principiante", val: "novato", icon: "👶", desc: "Busco algo dócil para aprender" },
        { label: "No, ya tengo experiencia", val: "experto", icon: "🎓", desc: "Conozco sus necesidades" }
      ]
    }
  ];

  // --- CLASIFICADOR DE AVES ---
  const inventario = useMemo(() => {
    const tienePalabra = (ave, palabras) => {
      const texto = `${ave.mutacion || ''} ${ave.especie || ''} ${ave.nombre || ''}`.toLowerCase();
      return palabras.some(p => texto.includes(p));
    };

    const listaVerdes = avesDisponibles.filter(ave => 
      tienePalabra(ave, ['verde', 'ancestral', 'jade', 'clásico', 'clasico'])
    );

    const listaAzules = avesDisponibles.filter(ave => 
      tienePalabra(ave, ['azul', 'blue', 'turquesa', 'violeta', 'cobalto'])
    );

    return { verdes: listaVerdes, azules: listaAzules };
  }, [avesDisponibles]);

  const obtenerRandom = (array) => array[Math.floor(Math.random() * array.length)];

  // --- LÓGICA DE PROCESAMIENTO ---
  const procesarRespuesta = (valor) => {
    const respuestasFinales = { ...respuestas, [preguntas[pasoActual].id]: valor };
    setRespuestas(respuestasFinales);

    if (pasoActual < preguntas.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      // Cálculo del resultado con delay para efecto visual
      setTimeout(() => {
          let ave = null;
          let alt = false;
          const quiereVerde = respuestasFinales.color === 'verde';

          if (quiereVerde) {
            if (inventario.verdes.length > 0) ave = obtenerRandom(inventario.verdes);
            else if (inventario.azules.length > 0) { ave = obtenerRandom(inventario.azules); alt = true; }
          } else {
            if (inventario.azules.length > 0) ave = obtenerRandom(inventario.azules);
            else if (inventario.verdes.length > 0) { ave = obtenerRandom(inventario.verdes); alt = true; }
          }
          
          setAveGanadora(ave);
          setEsAlternativa(alt);
          setFase('resultado');
      }, 50);
    }
  };

  const iniciarQuiz = () => setFase('preguntas');

  const reiniciar = () => {
    setFase('intro');
    setPasoActual(0);
    setRespuestas({});
    setAveGanadora(null);
  };

  const obtenerTextos = () => {
    if (!aveGanadora) return { titulo: "¡Ups!", desc: "Todos nuestros bebés ya tienen hogar por ahora." };

    const esAveVerde = inventario.verdes.some(v => v._id === aveGanadora._id);
    const nombreColor = esAveVerde ? "Verde Ancestral" : "Azul Turquesa";
    
    let descripcion = "";
    let badge = "";

    if (esAlternativa) {
        descripcion = `Sabemos que buscabas otro color, ¡pero mira a quién tenemos aquí! Este bebé ${nombreColor} (Anillo ${aveGanadora.anillo}) está disponible y buscando familia. A veces el ave nos elige a nosotros. ¿No es hermoso?`;
        badge = "¡Te presentamos una alternativa!";
    } else {
        descripcion = `¡Lo encontramos! Basado en tus respuestas, este hermoso ${nombreColor} es tu compañero ideal. Tiene la energía y personalidad que buscas.`;
        badge = "¡Es un Match Perfecto!";
    }

    return { 
        titulo: aveGanadora.mutacion || "Roseicollis",
        subtitulo: `Anillo Oficial: #${aveGanadora.anillo}`,
        desc: descripcion,
        badge: badge,
        colorBadge: esAlternativa ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
    };
  };

  const getImagenAve = (ave) => {
      if (!ave) return "/portada.png";
      const ruta = ave.foto || ave.fotoUrl;
      if (!ruta) return "/portada.png";
      if (ruta.startsWith('http')) return ruta;
      return `https://cunaalada-kitw.onrender.com${ruta}`;
  };

  return {
    fase,
    pasoActual,
    preguntas,
    aveGanadora,
    esAlternativa,
    iniciarQuiz,
    procesarRespuesta,
    reiniciar,
    obtenerTextos,
    getImagenAve
  };
};