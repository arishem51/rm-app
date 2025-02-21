"use client";

import { ReactNode } from "react";
import {
  Progress,
  AppProgressProvider as ProgressProvider,
} from "@bprogress/next";

const BProgressProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ProgressProvider
      height="2px"
      color="#1d4ed8"
      options={{ showSpinner: false, speed: 325, template: null }}
      shallowRouting
    >
      <Progress className="z-50 relative" />
      {children}
    </ProgressProvider>
  );
};

export default BProgressProvider;
