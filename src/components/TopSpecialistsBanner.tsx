import React from 'react';
import {
  Stethoscope,
  Star,
  CheckCircle,
  Calendar,
  Phone,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Doctor } from '../types';

interface TopSpecialistsBannerProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  onBookClick: (doctor: Doctor) => void;
}

export const TopSpecialistsBanner: React.FC<TopSpecialistsBannerProps> = ({
  doctors,
  onSelectDoctor,
  onBookClick
}) => {
  const topDoctors = doctors.slice(0, 4);

  return (
    <section className="py-12 bg-slate-100/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پزشکان تایید صلاحیت شده با استعلام نظام پزشکی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              جراحان برتر و متعهد به ارائه پاسپورت اصالت ایمپلنت
            </h2>
          </div>
          <a
            href="#directory-section"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            مشاهده همه جراحان و فیلتر پیشرفته &larr;
          </a>
        </div>

        {/* Doctor Cards Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Avatar and Verification */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={doc.avatar}
                      alt={`${doc.first_name} ${doc.last_name}`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                    {doc.verified && (
                      <span
                        className="absolute -bottom-1 -left-1 bg-emerald-500 text-white rounded-full p-0.5"
                        title="تاییدیه رسمی نظام پزشکی"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {doc.first_name} {doc.last_name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {doc.medical_council_code}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-800">{doc.rating}</span>
                      <span className="text-slate-400 text-[10px]">({doc.reviews_count} نظر)</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>{doc.experience_years} سال سابقه تخصصی</span>
                  </div>
                  {doc.passport_committed && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      <span>✓ متعهد به صدور شناسنامه اصالت قطعات</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {doc.bio}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectDoctor(doc)}
                  className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors"
                >
                  مشاهده پروفایل
                </button>
                <button
                  onClick={() => onBookClick(doc)}
                  className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <Calendar className="w-3 h-3" />
                  <span>نوبت‌دهی</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
