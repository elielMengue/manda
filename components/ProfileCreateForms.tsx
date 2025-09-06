'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '../lib/toast';

export default function ProfileCreateForms({ onSuccess }: { onSuccess?: (role: 'Apprenant' | 'Mentor' | 'Partenaire') => void }) {
  const router = useRouter();
  const [tab, setTab] = useState<'apprenant' | 'mentor' | 'partenaire'>('apprenant');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (endpoint: string, body: unknown) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Profil créé ✅', 'success');
      setMessage('Profil créé ✅');
      if (endpoint.includes('apprenant')) onSuccess?.('Apprenant');
      if (endpoint.includes('mentor')) onSuccess?.('Mentor');
      if (endpoint.includes('partenaire')) onSuccess?.('Partenaire');
      router.refresh();
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
      setMessage((e as { message?: string })?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setTab('apprenant')} className={`px-3 py-2 rounded-md border ${tab==='apprenant' ? 'bg-foreground/10' : 'hover:bg-foreground/5'}`}>Apprenant</button>
        <button onClick={() => setTab('mentor')} className={`px-3 py-2 rounded-md border ${tab==='mentor' ? 'bg-foreground/10' : 'hover:bg-foreground/5'}`}>Mentor</button>
        <button onClick={() => setTab('partenaire')} className={`px-3 py-2 rounded-md border ${tab==='partenaire' ? 'bg-foreground/10' : 'hover:bg-foreground/5'}`}>Partenaire</button>
      </div>

      {tab === 'apprenant' && <ApprenantForm loading={loading} onSubmit={(v) => submit('/api/profile/apprenant', v)} message={message} />}
      {tab === 'mentor' && <MentorForm loading={loading} onSubmit={(v) => submit('/api/profile/mentor', v)} message={message} />}
      {tab === 'partenaire' && <PartenaireForm loading={loading} onSubmit={(v) => submit('/api/profile/partenaire', v)} message={message} />}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className="opacity-80">{label}</span>
      <input {...props} className="mt-1 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm" />
    </label>
  );
}

function ApprenantForm({ loading, onSubmit, message }: { loading: boolean; onSubmit: (v: unknown) => void; message: string | null }) {
  const [bio, setBio] = useState('');
  const [profession, setProfession] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ bio, profession }); }} className="space-y-3">
      <Field label="Bio" value={bio} onChange={(e) => setBio(e.currentTarget.value)} placeholder="Votre bio" required />
      <Field label="Profession" value={profession} onChange={(e) => setProfession(e.currentTarget.value)} placeholder="Étudiant, Dev, ..." required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer profil apprenant'}</button>
      {message && <div className="text-sm opacity-80">{message}</div>}
    </form>
  );
}

function MentorForm({ loading, onSubmit, message }: { loading: boolean; onSubmit: (v: unknown) => void; message: string | null }) {
  const [specialite, setSpecialite] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ specialite, experience, bio }); }} className="space-y-3">
      <Field label="Spécialité" value={specialite} onChange={(e) => setSpecialite(e.currentTarget.value)} placeholder="Ex: Frontend" required />
      <Field label="Expérience" value={experience} onChange={(e) => setExperience(e.currentTarget.value)} placeholder="Ex: 5 ans" required />
      <Field label="Bio" value={bio} onChange={(e) => setBio(e.currentTarget.value)} placeholder="Votre bio" required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer profil mentor'}</button>
      {message && <div className="text-sm opacity-80">{message}</div>}
    </form>
  );
}

function PartenaireForm({ loading, onSubmit, message }: { loading: boolean; onSubmit: (v: unknown) => void; message: string | null }) {
  const [organisationName, setOrganisationName] = useState('');
  const [activitySector, setActivitySector] = useState('');
  const [juridicStatus, setJuridicStatus] = useState('');
  const [description, setDescription] = useState('');
  const [siteweb, setSiteweb] = useState('');
  const [contact, setContact] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ organisationName, activitySector, juridicStatus, description, siteweb, contact, logoUrl }); }} className="space-y-3">
      <Field label="Organisation" value={organisationName} onChange={(e) => setOrganisationName(e.currentTarget.value)} placeholder="Nom" required />
      <Field label="Secteur" value={activitySector} onChange={(e) => setActivitySector(e.currentTarget.value)} placeholder="Secteur" required />
      <Field label="Statut juridique" value={juridicStatus} onChange={(e) => setJuridicStatus(e.currentTarget.value)} placeholder="Ex: SAS" required />
      <Field label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} placeholder="Présentation" required />
      <Field label="Site web" value={siteweb} onChange={(e) => setSiteweb(e.currentTarget.value)} placeholder="https://..." required />
      <Field label="Contact" value={contact} onChange={(e) => setContact(e.currentTarget.value)} placeholder="contact@..." required />
      <Field label="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.currentTarget.value)} placeholder="https://..." required />
      <button disabled={loading} className="btn-accent disabled:opacity-60">{loading ? 'En cours…' : 'Créer profil partenaire'}</button>
      {message && <div className="text-sm opacity-80">{message}</div>}
    </form>
  );
}
