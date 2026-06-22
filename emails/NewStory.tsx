import { Heading, Img, Link, Preview, Text } from "react-email";
import EmailFooter from "./EmailFooter";
import EmailLayout from "./EmailLayout";
import { BODY_TEXT, BORDER, DARK, MUTED, SANS, SERIF } from "./theme";

interface NewStoryEmailProps {
  title?: string;
  caption?: string;
  url?: string;
  featuredImageUrl?: string;
  unsubscribeUrl?: string;
}

export default function NewStoryEmail({
  title = "Awesome new story",
  caption = "Here's the caption for the story, which is amazing.",
  url = "https://mattlane.us/stories/beautiful-analysis/",
  featuredImageUrl = "https://mattlane.us/images/featured_images/beautiful_analysis.jpg",
  unsubscribeUrl = "{{{RESEND_UNSUBSCRIBE_URL}}}",
}: NewStoryEmailProps) {
  const shareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <EmailLayout preview={<Preview>{caption}</Preview>}>
      <Heading
        style={{
          fontFamily: SERIF,
          fontSize: "26px",
          fontWeight: 700,
          color: DARK,
          margin: "0 0 12px",
        }}
      >
        🎉 New story alert!
      </Heading>
      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "0 0 28px",
        }}
      >
        Hey y&apos;all, I&apos;ve got some fresh mathematical musings for you,
        hot off the digital presses. Check it out:
      </Text>

      <Link
        href={url}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Img
            src={featuredImageUrl}
            alt={caption}
            width="552"
            height="310"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div style={{ padding: "16px 20px 20px" }}>
            <Heading
              style={{
                fontFamily: SERIF,
                fontSize: "20px",
                fontWeight: 700,
                color: DARK,
                margin: "0 0 8px",
              }}
            >
              {title}
            </Heading>
            <Text
              style={{
                fontFamily: SANS,
                fontSize: "14px",
                color: MUTED,
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              {caption}
            </Text>
          </div>
        </div>
      </Link>

      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "28px 0 0",
        }}
      >
        Please enjoy, and if you really dig it, I&apos;d love for you to share
        it with a friend.
      </Text>
      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "12px 0 0",
        }}
      >
        With love, light, and mathematical rigor,
      </Text>
      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "12px 0 0",
        }}
      >
        ❤️ Matt
      </Text>

      <EmailFooter shareUrl={shareUrl} unsubscribeUrl={unsubscribeUrl} />
    </EmailLayout>
  );
}
