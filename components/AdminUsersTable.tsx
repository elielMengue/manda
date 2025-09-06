'use client';

import { useState } from 'react';
import { toast } from '../lib/toast';

export type User = { id: number; firstName: string; lastName: string; email: string; role: 'Admin'|'Apprenant'|'Mentor'|'Partenaire'; status?: boolean; createdAt?: string };

export default function AdminUsersTable({ initial }: { initial: User[] }) {
  const [users, setUsers] = useState<User[]>(initial);

  const updateLocal = (id: number, patch: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const patchUser = async (id: number, body: Partial<User>) => {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data as User;
  };

  const onRoleChange = async (id: number, role: User['role']) => {
    const prev = users.find((u) => u.id === id)?.role;
    updateLocal(id, { role });
    try {
      await patchUser(id, { role });
      toast('Rôle mis à jour ✔️', 'success');
    } catch (e: unknown) {
      updateLocal(id, { role: prev });
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    }
  };

  const onToggleStatus = async (id: number) => {
    const current = users.find((u) => u.id === id)?.status ?? true;
    updateLocal(id, { status: !current });
    try {
      await patchUser(id, { status: !current });
      toast('Statut mis à jour ✔️', 'success');
    } catch (e: unknown) {
      updateLocal(id, { status: current });
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    }
  };

  return (
    <div className="table-3d">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">Nom</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Rôle</th>
            <th className="text-left p-2">Statut</th>
            <th className="text-left p-2">Créé le</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-foreground/10">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.firstName} {u.lastName}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select value={u.role} onChange={(e) => onRoleChange(u.id, e.currentTarget.value as User['role'])} className="rounded-md border border-foreground/20 bg-transparent px-2 py-1">
                  {(['Admin','Apprenant','Mentor','Partenaire'] as const).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <button onClick={() => onToggleStatus(u.id)} className="btn-outline h-8 text-xs">{u.status === false ? 'Inactif' : 'Actif'}</button>
              </td>
              <td className="p-2">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
              <td className="p-2"><ResetPasswordButton userId={u.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResetPasswordButton({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    const pwd = window.prompt('Nouveau mot de passe (min 6 caractères):');
    if (!pwd || pwd.length < 6) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: pwd }) });
      const data = await res.json().catch(()=>null);
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      toast('Mot de passe réinitialisé ✔️', 'success');
    } catch (e: unknown) {
      toast((e as { message?: string })?.message || 'Erreur', 'error');
    } finally { setLoading(false); }
  };
  return <button onClick={onClick} disabled={loading} className="btn-ghost h-8 text-xs">{loading ? '…' : 'Réinitialiser'}</button>;
}

