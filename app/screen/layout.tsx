// src/app/display/tv-view/page.tsx
export default function TVDisplayPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-white grid 
      grid-cols-[1fr_20%] grid-rows-[10%_1fr_15%]">
      
      {/* 1. HAUT (10%) - S'étend sur toute la largeur ou juste le milieu */}
      <header className="col-span-1 border-b border-white/10 flex items-center px-10">
        <img src="/logo.png" className="h-12" alt="Logo" />
        <h2 className="ml-auto text-2xl font-bold uppercase tracking-tighter">Nos Burgers</h2>
      </header>

      {/* 2. DROITE (20%) - Fixe sur toute la hauteur centrale */}
      <aside className="row-span-2 col-start-2 border-l border-white/10 bg-slate-800/50 p-6 flex flex-col items-center justify-between">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-indigo-400 mb-4">Scan & Order</p>
          <div className="bg-white p-4 rounded-3xl shrink-0">
             {/* QR CODE ICI */}
             <div className="w-32 h-32 bg-slate-200" />
          </div>
        </div>
        <div className="bg-indigo-600 w-full p-4 rounded-2xl text-center">
           <p className="text-[8px] font-black">WIFI PASSWORD</p>
           <p className="font-bold">Burger_Guest_2024</p>
        </div>
      </aside>

      {/* 3. MILIEU (CONTENU / LA CUISINE) */}
      <main className="p-8">
        {/* Ici on boucle sur les produits is_featured ou actifs */}
        <div className="grid grid-cols-2 gap-6 h-full">
           {/* Product Cards spécial TV */}
        </div>
      </main>

      {/* 4. BAS (15%) */}
      <footer className="col-span-1 border-t border-white/10 flex items-center px-10 bg-black">
        <div className="overflow-hidden whitespace-nowrap">
          <p className="text-2xl font-black italic animate-marquee">
             PROMO : -20% SUR TOUS LES DESSERTS JUSQU'À 18H ! 🍰 
          </p>
        </div>
      </footer>
    </div>
  );
}