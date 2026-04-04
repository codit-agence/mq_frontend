import { QrCode } from "lucide-react";

export default function PairingScreen({ code }: { code: string }) {
  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center text-white p-10 font-sans">
      <div className="max-w-4xl w-full text-center space-y-12">
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-blue-500">Qimo Stream</h1>
          <p className="text-2xl text-slate-400 font-medium">Connectez cet écran à votre espace client</p>
        </div>

        {/* CODE 4 CHIFFRES */}
        <div className="flex justify-center gap-6">
          {code.split("").map((digit, i) => (
            <div key={i} className="w-24 h-36 bg-slate-900 border-2 border-slate-800 rounded-[2rem] flex items-center justify-center text-7xl font-black text-white shadow-2xl">
              {digit}
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 inline-flex items-center gap-10">
          <div className="text-left space-y-2">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Étape suivante :</p>
            <p className="text-lg text-slate-200 leading-tight">
              Allez dans votre <b>Dashboard</b> <br /> 
              Section <b>TV Stream</b> &rarr; <b>Scanner TV</b> <br />
              Puis entrez ces chiffres.
            </p>
          </div>
          <div className="bg-white p-4 rounded-3xl">
            <QrCode size={100} className="text-black" />
          </div>
        </div>

      </div>
    </div>
  );
}