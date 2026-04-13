import { BaseTableRef } from '@/types/base-ref.type';
import { useRef } from 'react';
import BankingTable from './banking-table';

export default function BankingPage() {
  const tableRef = useRef<BaseTableRef>(null);

  const handleChooseBank = () => {
    
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {/* <BankingTable
          ref={tableRef}
          onChooseBank={handleChooseBank}
        /> */}
      </div>
    </div>
  )
}
