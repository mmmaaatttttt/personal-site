import React, { useState } from "react";
import styled from "styled-components";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Button, Icon } from "story_components";
import COLORS from "utils/styles";
import media from "utils/media";

const StyledMailWrapper = styled.div`
  text-align: center;
  width: 70%;
  margin: 0 auto;

  h3 {
    margin: 1rem 0;
  }

  p {
    margin: 1rem 0 0;
  }

  ${media.small`
    width: 90%;
  `};
`;

const StyledMailForm = styled.form`
  display: flex;
  justify-content: space-between;
  margin: 0 auto 0.4rem;
  width: 60%;

  ${media.small`
    width: 100%;
  `}

  ${media.extraSmall`
    flex-direction: column;
  `}

  button {
    flex: 1;
  }
`;

const StyledMailFormInput = styled.input`
  flex: 5;
  margin: 0.5rem;
  padding: 0.25rem;
`;

const messageColors = {
  error: COLORS.RED,
  success: COLORS.GREEN,
  sending: COLORS.BLACK
};

function handleSubmit(e, subscribe, email) {
  e.preventDefault();
  subscribe({ EMAIL: email });
}

function MailingList() {
  const [email, setEmail] = useState("");
  const url =
    "https://gmail.us4.list-manage.com/subscribe/post?u=086ea8b0ab81118b377fd87e3&amp;id=02d12fcfdd";
  return (
    <MailchimpSubscribe
      url={url}
      render={({ subscribe, status, message }) => {
        if (status === "success")
          return (
            <StyledMailWrapper>
              <p style={{ color: messageColors[status], marginBottom: "1rem" }}>{message}</p>
            </StyledMailWrapper>
          );
        return (
          <StyledMailWrapper>
            <h3>Never miss a story.</h3>
            <p>
              Join my mailing list and I'll let you know whenever I've got shiny
              new content. <em>No spam, I promise!</em>
            </p>
            <StyledMailForm
              onSubmit={e => handleSubmit(e, subscribe, email)}
            >
              <StyledMailFormInput
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                id="mailchimp-email"
                placeholder="Your email (required)"
              />
              {status === "sending" ? (
                <Button disabled>
                  <Icon name="spinner" spin />
                </Button>
              ) : (
                <Button>Subscribe!</Button>
              )}
            </StyledMailForm>
            {status === "error" && (
              <p
                style={{ color: messageColors[status] }}
                dangerouslySetInnerHTML={{ __html: message }}
              />
            )}
          </StyledMailWrapper>
        );
      }}
    />
  );
}

export default MailingList;
