import type { ReactNode } from "react";
import { Body, Container, Head, Html, Link, Text } from "react-email";
import { ORANGE, SANS, SERIF } from "./theme";

interface EmailLayoutProps {
  preview: ReactNode;
  children: ReactNode;
}

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview}
      <Body style={{ backgroundColor: "#ffffff", fontFamily: SANS, margin: 0 }}>
        <div style={{ backgroundColor: ORANGE, height: "4px" }} />
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "36px 24px 24px",
          }}
        >
          <Link href="https://mattlane.us" style={{ textDecoration: "none" }}>
            <Text
              style={{
                fontFamily: SERIF,
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: ORANGE,
                margin: "0 0 28px",
              }}
            >
              mattlane.us
            </Text>
          </Link>
          {children}
        </Container>
        <div style={{ backgroundColor: ORANGE, height: "4px" }} />
      </Body>
    </Html>
  );
}
