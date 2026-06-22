import { useState } from 'react';
import { useRouter } from 'next/router';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useSimAuth } from '../contexts/SimAuthContext';
import { simInput, simLabel, simBtnPrimary } from '../sim-ui';

export function SimLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSimAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const ok = await login(email, password);
      if (!ok) {
        setError("Email yoki parol noto'g'ri");
        return;
      }
      router.push('/student-information-management');
    } catch (err) {
      setError('Kirishda xatolik yuz berdi');
      console.error('SIM login error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sim-app w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-7 sm:p-8 shadow-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inklyuziv Ta&apos;lim
          </h2>
          <p className="text-gray-500 text-base mt-2">Tizimga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-base">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="sim-email" className={simLabel}>
              Email
            </label>
            <input
              id="sim-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={simInput}
              placeholder="email@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="sim-password" className={simLabel}>
              Parol
            </label>
            <input
              id="sim-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={simInput}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${simBtnPrimary} w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isLoading ? 'Kutilmoqda...' : 'Kirish'}
          </button>
        </form>

 
      </div>
    </div>
  );
}
