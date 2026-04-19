const MisPremios = () => {
  const [misAves, setMisAves] = useState([]);

  useEffect(() => {
    // Aquí haces un fetch filtrando por propietario (tu nombre)
    fetch('http://localhost:5000/api/aves')
      .then(res => res.json())
      .then(data => {
        const ganadas = data.filter(a => a.propietario === "Josué Pérez");
        setMisAves(ganadas);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <h2 className="text-2xl font-black text-white italic">MIS AGAPORNIS GANADOS 🏆</h2>
      {misAves.map(ave => (
        <div key={ave._id} className="bg-slate-900 border border-cyan-500/30 p-6 rounded-[2rem] flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <img src={ave.fotoUrl} className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500" />
            <div>
              <h4 className="text-white font-black uppercase italic">{ave.especie}</h4>
              <p className="text-slate-500 text-xs font-bold">Anillo: {ave.anillo}</p>
              <p className="text-emerald-400 text-[10px] font-black uppercase mt-1">✓ Pagado con Plumas</p>
            </div>
          </div>
          
          {/* QR para recoger */}
          <div className="bg-white p-2 rounded-xl">
            <QRCodeSVG value={ave._id} size={60} />
          </div>
        </div>
      ))}
      <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-center">
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">📍 Dirección de Recojo: Calle X, Col. Centro, Campeche</p>
      </div>
    </div>
  );
};