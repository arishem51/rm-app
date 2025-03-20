"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import { startCase } from "lodash";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").slice(1);

  return (
    <Breadcrumb className="pl-1">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const segmentPath = startCase(segment);
          const originSegment = segments.slice(0, index + 1).join("/");

          return (
            <Fragment key={segment}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {React.createElement(
                  isLast ? BreadcrumbPage : BreadcrumbLink,
                  isLast ? {} : { asChild: true },
                  isLast ? (
                    segmentPath
                  ) : (
                    <Link prefetch href={"/".concat(originSegment)}>
                      {segmentPath}
                    </Link>
                  )
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
export default Navbar;
