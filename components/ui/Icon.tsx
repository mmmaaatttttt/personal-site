import type { LucideIcon } from "lucide-react";
import type { SVGProps } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
  spin?: boolean;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    { icon: IconComponent, size = 20, className, spin = false, ...props },
    ref,
  ) => {
    return (
      <IconComponent
        ref={ref}
        size={size}
        className={cn("shrink-0", spin && "animate-spin", className)}
        {...props}
      />
    );
  },
);
Icon.displayName = "Icon";

export { Icon };
