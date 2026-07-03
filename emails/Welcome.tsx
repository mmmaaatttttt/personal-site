import { Heading, Preview, Text } from "react-email";
import EmailFooter from "./EmailFooter";
import EmailLayout from "./EmailLayout";
import { BODY_TEXT, DARK, SANS, SERIF } from "./theme";

export default function WelcomeEmail() {
  return (
    <EmailLayout preview={<Preview>Hello from Matt Lane!</Preview>}>
      <Heading
        style={{
          fontFamily: SERIF,
          fontSize: "26px",
          fontWeight: 700,
          color: DARK,
          margin: "0 0 12px",
        }}
      >
        👋 What have you done?!?
      </Heading>

      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "0 0 16px",
        }}
      >
        You have volunteered to read my innermost thoughts? Well, it&apos;s your
        funeral.
      </Text>

      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "0 0 16px",
        }}
      >
        I promise not to spam you with emails. You&apos;ll get a notification
        whenever I publish a new story. And if I have any announcements to make,
        I&apos;ll probably send them to your inbox too.
      </Text>

      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "0 0 16px",
        }}
      >
        Otherwise, I promise to keep your inbox light. If you really can&apos;t
        get enough of me, you can follow me on Bluesky. But honestly, this
        should be more than sufficient.
      </Text>

      <Text
        style={{
          fontFamily: SANS,
          fontSize: "16px",
          color: BODY_TEXT,
          lineHeight: "1.6",
          margin: "0 0 16px",
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
          margin: "0",
        }}
      >
        ❤️ Matt
      </Text>

      <EmailFooter />
    </EmailLayout>
  );
}
