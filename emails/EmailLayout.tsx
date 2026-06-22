import type { ReactNode } from "react";
import { Body, Container, Font, Head, Html, Link, Text } from "react-email";
import { ORANGE, SANS, SERIF } from "./theme";

interface EmailLayoutProps {
  preview: ReactNode;
  children: ReactNode;
}

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Domine"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/domine/v23/L0xhDFMnlVwD4h3Lt9JWnbX3jG-2X0DAI10VErGuW8Q.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Open Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsiH0B4gaVc.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
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
