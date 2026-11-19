import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track, trackOutbound } from "@/utils/analytics";

/**
 * An anchor that records lead attribution when clicked.
 *
 * Every "visit the winner", phone and email link on this page is a conversion
 * event. Without this, there is no number to point at in a referral discussion —
 * and no way to tell whether the LoopLink embed or the rankings actually drive
 * calls. Renders a plain <a>, so behaviour and accessibility are unchanged.
 */
export default function OutboundLink({
  href,
  label,
  children,
  onClick,
  ...rest
}: {
  href: string;
  /** Human-readable name of the destination, for reporting. */
  label: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const isPhone = href.startsWith("tel:");
  const isEmail = href.startsWith("mailto:");

  return (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (isPhone || isEmail) {
          track("quote_click", { channel: isPhone ? "phone" : "email", label });
        } else {
          trackOutbound(href, label);
        }
      }}
    >
      {children}
    </a>
  );
}
