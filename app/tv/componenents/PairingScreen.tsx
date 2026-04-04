"use client";
import { tvService } from '@/src/features/tvapp/services/tvapp.service';
import { useTVStore } from '@/src/features/tvapp/store/tvapp.store';
import { getDeviceInfo } from '@/src/utils/helpers/getDeviceInfo';
import React, { useEffect, useState } from 'react';

const PairingScreen: React.FC = () => {
  const [pairingCode, setPairingCode] = useState(''); // Code 6 chiffres
  const [displaySecurityCode, setDisplaySecurityCode] = useState(''); // Code 4 chiffres reçu du serveur
  const [screenId, setScreenId] = useState<string | null>(null);
  const [isWaitingForSecurity, setIsWaitingForSecurity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const setAuth = useTVStore((state) => state.setAuth);

  // ÉTAPE 2 : Envoyer le code 6 chiffres saisi sur la TV
  const handleInit = async () => {
    if (pairingCode.length < 6) return;
    setIsLoading(true);
    try {
      const info = getDeviceInfo();
      // Le backend doit renvoyer { screen_id, security_code }
      const res = await tvService.initialize(pairingCode, info);
      
      setScreenId(res.screen_id);
      setDisplaySecurityCode(res.security_code); // Les 4 chiffres générés par le serveur
      setIsWaitingForSecurity(true);
    } catch (err) {
      alert("Code invalide ou expiré. Réessayez.");
      setPairingCode('');
    } finally {
      setIsLoading(false);
    }
  };

  // ÉTAPE 3 : Polling (Vérification automatique de la validation du gérant)
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (isWaitingForSecurity && screenId) {
      pollInterval = setInterval(async () => {
       try {
        const authStatus = await tvService.checkAuthStatus(screenId);
        
        // 1. Si on reçoit un code de sécurité qu'on n'avait pas, on l'affiche
        if (authStatus.security_code && !displaySecurityCode) {
          setDisplaySecurityCode(authStatus.security_code);
        }

        // 2. Si c'est validé, on connecte
        if (authStatus.is_paired && authStatus.access_token) {
          setAuth(screenId, authStatus.access_token);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.log("Erreur polling ou en attente...");
      }
    }, 3000);
  }
  return () => clearInterval(pollInterval);
}, [isWaitingForSecurity, screenId, displaySecurityCode]); // Ajoute displaySecurityCode ici

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0a0a0a', 
      color: 'white', 
      height: '100vh',
      fontFamily: 'sans-serif' 
    }}>
      
      {!isWaitingForSecurity ? (
        /* ÉCRAN DE SAISIE INITIAL (6 CHIFFRES) */
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Bienvenue</h1>
          <p style={{ fontSize: '1.5rem', color: '#888', marginBottom: '40px' }}>
            Entrez le code de 6 chiffres affiché sur votre Dashboard pour connecter cette TV.
          </p>
          
          <input 
            type="text"
            value={pairingCode} 
            onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="000000"
            style={{ 
              fontSize: '4rem', 
              textAlign: 'center', 
              width: '100%', 
              background: '#222', 
              border: '2px solid #444', 
              color: '#007bff',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '30px',
              letterSpacing: '10px'
            }}
          />
          
          <button 
            onClick={handleInit}
            disabled={pairingCode.length !== 6 || isLoading}
            style={{ 
              fontSize: '1.5rem', 
              padding: '15px 50px', 
              borderRadius: '10px', 
              background: '#007bff', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              opacity: (pairingCode.length !== 6 || isLoading) ? 0.5 : 1
            }}
          >
            {isLoading ? "Connexion..." : "VALIDER"}
          </button>
        </div>
      ) : (
        /* ÉCRAN DE VÉRIFICATION DE SÉCURITÉ (4 CHIFFRES) */
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem' }}>Vérification de sécurité</h1>
          <p style={{ fontSize: '1.5rem', color: '#aaa', margin: '20px 0' }}>
            Un gérant doit valider ce code sur le Dashboard :
          </p>
          
          <div style={{ 
            fontSize: '8rem', 
            color: '#00ff00', 
            fontWeight: 'black', 
            background: '#111', 
            padding: '20px 60px', 
            borderRadius: '20px',
            border: '2px solid #00ff0033',
            display: 'inline-block',
            margin: '20px 0',
            letterSpacing: '15px'
          }}>
             {displaySecurityCode}
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#00ff00', borderRadius: '50%', marginRight: '10px' }}></span>
              En attente de confirmation...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PairingScreen;