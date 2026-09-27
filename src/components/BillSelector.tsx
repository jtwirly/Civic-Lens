import React from 'react';
import { Bill } from '../types/civic';
import { FilePlus2, Check } from 'lucide-react';

interface BillSelectorProps {
  bills: Bill[];
  selectedBill: Bill;
  onSelectBill: (bill: Bill) => void;
  onOpenCustomBill: () => void;
}

export const BillSelector: React.FC<BillSelectorProps> = ({
  bills,
  selectedBill,
  onSelectBill,
  onOpenCustomBill,
}) => {
  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 font-sans">
            <span>Select Parliamentary Bill</span>
            <span aria-hidden="true">/</span>
            <span className="text-stone-800 font-medium">Real Statutory Corpus</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
            {bills.map((bill) => {
              const isSelected = selectedBill.id === bill.id;
              return (
                <button
                  key={bill.id}
                  onClick={() => onSelectBill(bill)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <span className="font-mono">{bill.code}</span>
                  <span className="hidden sm:inline text-stone-400">·</span>
                  <span className="hidden sm:inline truncate max-w-[130px]">{bill.popularName.split('(')[0]}</span>
                </button>
              );
            })}

            <button
              onClick={onOpenCustomBill}
              className="px-2.5 py-1.5 text-xs font-medium text-amber-800 hover:text-amber-950 rounded-md hover:bg-stone-200/60 transition-colors flex items-center gap-1 ml-1"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Custom Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
