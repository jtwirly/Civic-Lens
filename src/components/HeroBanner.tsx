import React from 'react';
import { Bill } from '../types/civic';

interface HeroBannerProps {
  selectedBill: Bill;
  onExploreBill?: () => void;
  onOpenArchitecture?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedBill,
}) => {
  return (
    <section className="relative border-b border-stone-200 bg-[#F7F4EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Editorial Narrative Column */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-stone-900 leading-[1.15] text-balance mb-4">
              Turn complex legislation into plain understanding and direct civic action.
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-sans max-w-2xl">
              Every year, thousands of pages of law pass through Parliament, written in dense statutory clauses. <strong className="text-stone-900 font-semibold">Civic Lens</strong> translates bills and laws into what changes for you, and empowers you with strategies to impact them.
            </p>
          </div>

          {/* Featured Visual & Bill Marquee Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="relative h-48 w-full rounded-md overflow-hidden bg-stone-100 mb-4">
                <img
                  src="/src/assets/images/civic_parliament_hero_1790395388073.jpg"
                  alt="Library of Parliament and Centre Block in Ottawa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback container if image fails to render
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="text-xs font-sans tracking-wide uppercase text-stone-200">Featured Study</div>
                    <div className="text-lg font-serif font-medium leading-snug">{selectedBill.popularName}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-mono text-stone-800 font-medium">{selectedBill.code}</span>
                  <span>{selectedBill.parliamentSession}</span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedBill.summaryPlain}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Legislative Stage:</span>
                  <span className="font-medium text-amber-800">{selectedBill.currentStage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
