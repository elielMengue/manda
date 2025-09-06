'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleWithRole() {
  const start = async () => {
    // Uniquement Apprenants via Google
    await signIn('google', { callbackUrl: `/onboarding?role=Apprenant` });
  };
  return (
    <div className="space-y-3">
      <div className="text-sm opacity-80">Apprenants uniquement (Google)</div>
      <button onClick={start} className="btn-outline flex items-center gap-2 justify-center">
        <FcGoogle className="text-lg" /> Continuer avec Google
      </button>
      <p className="text-xs opacity-70">En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.</p>
    </div>
  );
}
