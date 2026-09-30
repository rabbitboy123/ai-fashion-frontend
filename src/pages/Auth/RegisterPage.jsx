import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import AuthVaultScene3D from '@/components/3d/AuthVaultScene3D';
import Card3DTilt from '@/components/3d/Card3DTilt';
import useAuth from '@/hooks/useAuth';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setErrorMessage(result.message || 'Đăng ký tài khoản không thành công.');
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-[#E4E4E7] bg-white shadow-xl">
        
        {/* Left Col: 3D Bespoke Atelier Chamber */}
        <div className="relative bg-[#121212] p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[380px] lg:min-h-[560px]">
          {/* Three.js 3D WebGL Scene */}
          <div className="absolute inset-0 z-0">
            <AuthVaultScene3D className="w-full h-full" />
          </div>

          {/* Vignette Overlay for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/40 pointer-events-none z-10" />

          {/* Top Label */}
          <div className="relative z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#C5A880] text-[10px] font-semibold tracking-[0.25em] uppercase border border-[#C5A880]/30">
              <Sparkles className="w-3 h-3" />
              <span>Bespoke Membership</span>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="relative z-20 space-y-2 mt-auto">
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight leading-tight">
              Khởi Tạo Danh Tính <br />
              <span className="italic font-light text-[#C5A880]">Thành Viên Độc Quyền</span>
            </h2>
            <p className="text-xs text-[#A1A1AA] font-light max-w-sm leading-relaxed">
              Trở thành thành viên để được quyền truy cập vào các bản phát hành giới hạn và dịch vụ stylist 3D cá nhân hóa.
            </p>
          </div>
        </div>

        {/* Right Col: 3D Tilt Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#FAFAFA]">
          <Card3DTilt maxTilt={6} className="w-full">
            <div className="bg-white rounded-2xl border border-[#E4E4E7] p-6 sm:p-8 shadow-sm [transform-style:preserve-3d]">
              <div className="space-y-1 mb-6 [transform:translateZ(10px)]">
                <span className="text-[10px] font-semibold text-[#C5A880] tracking-[0.2em] uppercase">
                  Tạo Tài Khoản Mới
                </span>
                <h1 className="text-2xl font-serif font-bold text-[#121212]">
                  Đăng Ký Thành Viên
                </h1>
                <p className="text-xs text-[#71717A] font-light">
                  Chỉ mất vài giây để bắt đầu hành trình may đo cá nhân hóa.
                </p>
              </div>

              {/* Thông báo lỗi nếu có */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50/80 border border-red-200/80 flex items-start gap-2.5 text-red-700 text-xs animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="space-y-3.5 [transform:translateZ(15px)]" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                    Họ Và Tên
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] focus:bg-white transition-all text-[#121212]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] focus:bg-white transition-all text-[#121212]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                    Mật Khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] focus:bg-white transition-all text-[#121212]"
                    />
                  </div>
                </div>

                <div className="pt-2 [transform:translateZ(20px)]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#121212] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A880] hover:text-[#121212] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang khởi tạo danh tính...</span>
                      </>
                    ) : (
                      <>
                        <span>Hoàn Tất Đăng Ký</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="pt-5 border-t border-[#E4E4E7] mt-5 text-center text-xs text-[#71717A] [transform:translateZ(10px)]">
                Đã sở hữu tài khoản?{' '}
                <Link to="/login" className="text-[#C5A880] font-semibold hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </Card3DTilt>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
