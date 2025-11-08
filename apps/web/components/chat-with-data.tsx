'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { chatWithData } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Send } from 'lucide-react';

export function ChatWithData() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    sql: string;
    data: any[];
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await chatWithData(query);
      setResult(response);
    } catch (error: any) {
      setResult({
        sql: '',
        data: [],
        error: error.message || 'Failed to process query',
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "What's the total spend in the last 90 days?",
    "List top 5 vendors by spend",
    "Show overdue invoices as of today",
    "What is the average invoice value?",
    "How many invoices are pending?",
  ];

  return (
    <div className="space-y-6">
      <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1C1C1C]">Chat with Data</CardTitle>
          <CardDescription className="text-xs font-medium text-[#64748B]">
            Ask questions about your data in natural language. The AI will generate SQL queries and return results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question about your data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !query.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Processing...' : 'Send'}
              </Button>
            </div>
          </form>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Example queries:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(example)}
                  disabled={loading}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {result.error ? (
            <Card className="border border-[#ED1C24] bg-white rounded-lg">
              <CardHeader>
                <CardTitle className="text-[#ED1C24] text-base font-semibold">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#1C1C1C]">{result.error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[#1C1C1C]">Generated SQL</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-[#E3E6F0] p-4 rounded-md overflow-x-auto text-sm text-[#1C1C1C]">
                    <code>{result.sql}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card className="border border-[#E4E4E9] shadow-sm bg-white rounded-lg">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[#1C1C1C]">Results</CardTitle>
                  <CardDescription className="text-xs font-medium text-[#64748B]">
                    {result.data.length} row{result.data.length !== 1 ? 's' : ''} returned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.data.length > 0 ? (
                    <div className="rounded-md border border-[#E4E4E9] overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-white">
                            {Object.keys(result.data[0]).map((key) => (
                              <TableHead key={key} className="font-semibold text-[#1C1C1C]">{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.data.map((row, idx) => (
                            <TableRow key={idx} className="border-b border-[#E4E4E9]">
                              {Object.values(row).map((value: any, cellIdx) => (
                                <TableCell key={cellIdx} className="text-[#1C1C1C]">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-[#64748B]">No results returned</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}

