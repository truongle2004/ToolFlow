import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { SpeedTestResult } from "../types";

interface SpeedTestHistoryProps {
  history: SpeedTestResult[];
}

export function SpeedTestHistory({ history }: SpeedTestHistoryProps) {
  if (history.length === 0) return null;

  return (
    <Card className="rounded-3xl shadow-sm w-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="p-2 rounded-xl bg-primary text-primary-foreground">
          <History className="w-4 h-4" />
        </div>
        <CardTitle className="text-base font-semibold">Recent Tests</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Time</TableHead>
              <TableHead className="text-center">Ping</TableHead>
              <TableHead className="text-center">Jitter</TableHead>
              <TableHead className="text-center">Download</TableHead>
              <TableHead className="text-center pr-6">Upload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6 text-muted-foreground text-sm">
                  {r.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {i === 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 text-xs rounded-full"
                    >
                      Latest
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center font-mono">
                  {r.ping} ms
                </TableCell>
                <TableCell className="text-center font-mono">
                  {r.jitter} ms
                </TableCell>
                <TableCell className="text-center font-mono">
                  {r.download} Mbps
                </TableCell>
                <TableCell className="text-center font-mono pr-6">
                  {r.upload} Mbps
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
