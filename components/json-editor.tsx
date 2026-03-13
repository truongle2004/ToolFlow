"use client";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  CheckCircle,
  Clipboard,
  Check,
  Trash2,
  WandSparkles,
  Clock,
  XCircle,
} from "lucide-react";

function isJsonObject(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

export default function ToolFlowJsonEditor() {
  const [data, setData] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [lineCount, setLineCount] = useState<number>(1);
  const [charCount, setCharCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const isJsonValue = useRef<boolean>(false);

  const handleOnChange = (value: string): void => {
    setData(value);
    setCharCount(value.length);
    setLineCount(value.split("\n").length);
  };

  useEffect(() => {
    if (data.trim() === "") {
      setIsValid(null);
    } else {
      const valid = isJsonObject(data);
      setIsValid(valid);
      isJsonValue.current = valid;
    }
  }, [data]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(data);
      setData(JSON.stringify(parsed, null, 2));
    } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setData("");
    setIsValid(null);
  };

  const statusBadge = (() => {
    if (isValid === null)
      return {
        label: "Awaiting Input",
        variant: "secondary" as const,
        icon: <Clock className="w-3 h-3" />,
      };
    if (isValid)
      return {
        label: "Valid JSON",
        variant: "default" as const,
        icon: <CheckCircle className="w-3 h-3" />,
      };
    return {
      label: "Invalid JSON",
      variant: "destructive" as const,
      icon: <XCircle className="w-3 h-3" />,
    };
  })();

  return (
    <TooltipProvider>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">JSON Editor</p>
            <span className="text-xs text-muted-foreground">
              · ToolFlow Studio
            </span>
          </div>
          <Badge
            variant={statusBadge.variant}
            className="flex items-center gap-1.5"
          >
            {statusBadge.icon}
            {statusBadge.label}
          </Badge>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="sm" onClick={handleFormat}>
                  <WandSparkles className="w-3.5 h-3.5 mr-1.5" />
                  Format
                </Button>
              </TooltipTrigger>
              <TooltipContent>Auto-format JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className={copied ? "text-green-600" : ""}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy to clipboard"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear editor</TooltipContent>
            </Tooltip>
          </div>

          <span className="text-xs text-muted-foreground">
            {lineCount} lines · {charCount} chars
          </span>
        </div>

        {/* Editor */}
        <AceEditor
          mode="json"
          theme="github"
          value={data}
          onChange={handleOnChange}
          name="json_editor"
          width="100%"
          height="420px"
          placeholder="// Paste or type your JSON here..."
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            dragEnabled: true,
            showPrintMargin: false,
            tabSize: 2,
            fontSize: 13,
          }}
        />

        {/* Footer */}
        <Separator className="opacity-50" />
        <div className="flex items-center justify-between px-4 py-1.5">
          <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
            JSON · UTF-8
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
            <span>Tab: 2 spaces</span>
            <Separator orientation="vertical" className="h-3 opacity-50" />
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
