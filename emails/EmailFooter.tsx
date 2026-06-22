import { Hr, Link, Text } from "react-email";
import { BORDER, ORANGE, SANS, SUBTLE } from "./theme";

interface EmailFooterProps {
  shareUrl?: string;
  unsubscribeUrl?: string;
}

export default function EmailFooter({
  shareUrl,
  unsubscribeUrl,
}: EmailFooterProps) {
  return (
    <>
      <Hr style={{ borderColor: BORDER, margin: "28px 0 20px" }} />
      <Text
        style={{
          fontFamily: SANS,
          fontSize: "13px",
          color: SUBTLE,
          margin: "0 0 8px",
        }}
      >
        <Link
          href="https://buymeacoffee.com/mattlane"
          style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}
        >
          ☕ Buy me a coffee
        </Link>
        {shareUrl && (
          <>
            {"  ·  "}
            <Link
              href={shareUrl}
              style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}
            >
              🦋 Share on Bluesky
            </Link>
          </>
        )}
        {"  ·  "}
        <Link
          href="https://bsky.app/profile/mattlane.us"
          style={{ color: SUBTLE, textDecoration: "none" }}
        >
          @mattlane.us
        </Link>
      </Text>
      {unsubscribeUrl && (
        <Text
          style={{
            fontFamily: SANS,
            fontSize: "12px",
            color: SUBTLE,
            margin: "8px 0 0",
          }}
        >
          <Link href={unsubscribeUrl} style={{ color: SUBTLE }}>
            Unsubscribe
          </Link>
        </Text>
      )}
    </>
  );
}
