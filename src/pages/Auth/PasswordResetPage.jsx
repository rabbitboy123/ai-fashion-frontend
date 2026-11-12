import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import authService from '@/services/authService';

const copy = {
  back: '\u0051uay l\u1ea1i \u0111\u0103ng nh\u1eadp',
  title: '\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u',
  description: 'Nh\u1eadn m\u00e3 x\u00e1c minh qua email, sau \u0111\u00f3 t\u1ea1o m\u1eadt kh\u1ea9u m\u1edbi.',
  email: 'Email t\u00e0i kho\u1ea3n',
  send: 'G\u1eedi m\u00e3 x\u00e1c minh',
  code: 'M\u00e3 x\u00e1c minh 6 ch\u1eef s\u1ed1',
  password: 'M\u1eadt kh\u1ea9u m\u1edbi',
  submit: '\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u',
  genericSent: 'N\u1ebfu email t\u1ed3n t\u1ea1i, m\u00e3 x\u00e1c minh s\u1ebd \u0111\u01b0\u1ee3c g\u1eedi \u0111\u1ebfn h\u1ed9p th\u01b0 c\u1ee7a b\u1ea1n.',
  requestError: 'Kh\u00f4ng th\u1ec3 g\u1eedi y\u00eau c\u1ea7u. Vui l\u00f2ng th\u1eed l\u1ea1i.',
  resetError: 'M\u00e3 x\u00e1c minh kh\u00f4ng h\u1ee3p l\u1ec7 ho\u1eb7c \u0111\u00e3 h\u1ebft h\u1ea1n.',
  success: '\u0110\u1eb7t l\u1ea1i m\u1eadt kh\u1ea9u th\u00e0nh c\u00f4ng.',
};
const inputClass = 'w-full px-4 py-3 text-sm bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]';

export default function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestCode = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      const result = await authService.requestPasswordReset(email.trim());
      setCodeSent(true);
      setMessage(result?.message || copy.genericSent);
    } catch (e) {
      setError(e.response?.data?.message || copy.requestError);
    } finally { setLoading(false); }
  };

  const submitReset = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      const result = await authService.resetPassword({ email: email.trim(), code: code.trim(), newPassword });
      navigate('/login', { replace: true, state: { message: result?.message || copy.success } });
    } catch (e) {
      setError(e.response?.data?.message || copy.resetError);
    } finally { setLoading(false); }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <section className="bg-white border border-[#E4E4E7] rounded-3xl p-7 sm:p-9 shadow-sm space-y-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs text-[#71717A] hover:text-[#121212]"><ArrowLeft className="w-4 h-4" /> {copy.back}</Link>
        <div className="space-y-2"><span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C5A880]">Bespoke Atelier</span><h1 className="text-2xl font-serif text-[#121212]">{copy.title}</h1><p className="text-sm text-[#71717A]">{copy.description}</p></div>
        {message && <p role="status" className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm">{message}</p>}
        {error && <p role="alert" className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>}
        {!codeSent ? (
          <form onSubmit={requestCode} className="space-y-4"><label className="block text-xs font-semibold">{copy.email}<input className={`${inputClass} mt-2`} type="email" required maxLength={150} value={email} onChange={(e) => setEmail(e.target.value)} /></label><button disabled={loading} className="w-full rounded-xl bg-[#121212] text-white py-3 text-sm font-semibold disabled:opacity-50">{loading ? '...' : copy.send}</button></form>
        ) : (
          <form onSubmit={submitReset} className="space-y-4"><label className="block text-xs font-semibold">{copy.code}<input className={`${inputClass} mt-2`} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} /></label><label className="block text-xs font-semibold">{copy.password}<input className={`${inputClass} mt-2`} type="password" minLength={6} maxLength={100} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></label><button disabled={loading} className="w-full rounded-xl bg-[#121212] text-white py-3 text-sm font-semibold disabled:opacity-50">{loading ? '...' : copy.submit}</button><button type="button" className="w-full text-xs text-[#71717A] hover:text-[#121212]" onClick={() => { setCodeSent(false); setMessage(''); setError(''); }}>Resend code</button></form>
        )}
      </section>
    </main>
  );
}
