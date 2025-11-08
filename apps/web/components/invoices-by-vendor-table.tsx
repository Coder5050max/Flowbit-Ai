'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VendorData {
  vendor: string;
  invoiceCount: number;
  netValue: number;
  invoices: any[];
}

export function InvoicesByVendorTable({ data }: { data: VendorData[] }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-[#64748B] text-sm">
        No data available
      </div>
    );
  }

  // Get top vendors (limit to reasonable number for display)
  const topVendors = data.slice(0, 10);

  return (
    <div className="rounded-md border border-[#E4E4E9] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white">
            <TableHead className="font-semibold text-[#1C1C1C]">Vendor</TableHead>
            <TableHead className="font-semibold text-[#1C1C1C]"># Invoices</TableHead>
            <TableHead className="font-semibold text-[#1C1C1C] text-right">Net Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topVendors.map((vendor, idx) => (
            <TableRow key={idx} className="hover:bg-gray-50 border-b border-[#E4E4E9]">
              <TableCell className="font-medium text-[#1C1C1C]">{vendor.vendor}</TableCell>
              <TableCell className="text-[#64748B]">
                {vendor.invoices.length > 0 
                  ? formatDate(vendor.invoices[0].issueDate)
                  : vendor.invoiceCount}
              </TableCell>
              <TableCell className="text-right font-medium text-[#1C1C1C]">
                {formatCurrency(vendor.netValue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

