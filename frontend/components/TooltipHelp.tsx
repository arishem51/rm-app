"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";

type Props = {
  trigger: {
    text?: string;
    className?: string;
  };
  content: {
    text: string;
    className?: string;
  };
  icon?: React.ReactNode;
};

const TooltipHelp = ({ trigger, content, icon }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild className="inline-flex items-center">
        <div>
          <span className={trigger.className}>{trigger.text}</span>
          <Button size="icon" variant="outline" className="w-6 h-6 border-none">
            {icon ?? <CircleHelp />}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className={cn("text-sm", content.className)}>{content.text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipHelp;
