import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Direktor } from '../types/direktor';
import { getSimApiUrl } from '../api';

export type SimUserRole = 'admin' | 'direktor';

export interface SimUser {
  email: string;
  role: SimUserRole;
  schoolName?: string;
  region?: string;
  districtOrCity?: string;
}

interface SimAuthContextType {
  user: SimUser | null;
  direktorlar: Direktor[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addDirektor: (direktor: Direktor) => Promise<void>;
  updateDirektor: (id: string, direktor: Direktor) => Promise<void>;
  deleteDirektor: (id: string) => Promise<void>;
}

const SimAuthContext = createContext<SimAuthContextType | undefined>(undefined);

export function SimAuthProvider({ children }: { children: ReactNode }) {
  const API_URL = getSimApiUrl();

  const [user, setUser] = useState<SimUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('sim_user');
      return raw ? (JSON.parse(raw) as SimUser) : null;
    } catch {
      return null;
    }
  });

  const [direktorlar, setDirektorlar] = useState<Direktor[]>([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch(`${API_URL}/direktors?role=admin`)
        .then(async r => {
          if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            throw new Error(err.message || `Server xatosi (${r.status})`);
          }
          return r.json();
        })
        .then(data => {
          if (!Array.isArray(data)) return setDirektorlar([]);
          const normalized = data.map((d: Direktor & { _id?: string }) => ({
            ...d,
            id: d.id || d._id,
          }));
          setDirektorlar(normalized as Direktor[]);
        })
        .catch((e: Error) => {
          setDirektorlar([]);
          toast.error(e.message || 'Direktorlarni yuklashda xatolik');
        });
    } else {
      setDirektorlar([]);
    }
  }, [user, API_URL]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;
      const data = await res.json();
      setUser(data);
      try {
        localStorage.setItem('sim_user', JSON.stringify(data));
      } catch {
        /* localStorage unavailable */
      }
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('sim_user');
    } catch {
      /* localStorage unavailable */
    }
  };

  const addDirektor = async (direktor: Direktor) => {
    try {
      const payload = { ...direktor, role: 'direktor' as const };
      delete (payload as { id?: string }).id;
      const res = await fetch(`${API_URL}/direktors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Server error' }));
        console.error('Failed to create direktor', err);
        toast.error(err.message || 'Direktor yaratishda xatolik');
        return;
      }
      const created = await res.json();
      const norm = { ...created, id: created.id || created._id };
      setDirektorlar(prev => [...prev, norm]);
      toast.success("Direktor muvaffaqiyatli qo'shildi!");
    } catch (e) {
      console.error('Network error creating direktor', e);
      toast.error('Tarmoq xatosi — direktor yaratilmadi');
    }
  };

  const updateDirektor = async (id: string, updatedDirektor: Direktor) => {
    try {
      const payload = { ...updatedDirektor, role: 'direktor' as const };
      delete (payload as { id?: string }).id;
      const res = await fetch(`${API_URL}/direktors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Server error' }));
        console.error('Failed to update direktor', err);
        toast.error(err.message || 'Direktorni yangilashda xatolik');
        return;
      }
      const data = await res.json();
      const norm = { ...data, id: data.id || data._id };
      setDirektorlar(prev => prev.map(d => (d.id === id ? norm : d)));
      toast.success('Direktor ma\'lumotlari yangilandi!');
    } catch (e) {
      console.error('Network error updating direktor', e);
      toast.error('Tarmoq xatosi — direktor yangilanmadi');
    }
  };

  const deleteDirektor = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/direktors/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Server error' }));
        console.error('Failed to delete direktor', err);
        toast.error(err.message || "Direktorni o'chirishda xatolik");
        return;
      }
      setDirektorlar(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error('Network error deleting direktor', e);
      toast.error("Tarmoq xatosi — direktor o'chirilmadi");
    }
  };

  return (
    <SimAuthContext.Provider
      value={{ user, direktorlar, login, logout, addDirektor, updateDirektor, deleteDirektor }}
    >
      {children}
    </SimAuthContext.Provider>
  );
}

export function useSimAuth() {
  const context = useContext(SimAuthContext);
  if (context === undefined) {
    throw new Error('useSimAuth must be used within a SimAuthProvider');
  }
  return context;
}
