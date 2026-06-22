import { render } from "react-email";
import NewStoryEmail from "../emails/NewStory";

const meta = JSON.parse(process.env.META ?? "{}");
const slug = process.env.SLUG ?? "";
const url = `https://mattlane.us/stories/${slug}/`;
const featuredImageUrl = `https://mattlane.us${meta.featured_image.replace(/^(\.\.\/)+images\//, "/images/")}`;

const html = await render(
  <NewStoryEmail
    title={meta.title}
    caption={meta.caption}
    url={url}
    featuredImageUrl={featuredImageUrl}
    unsubscribeUrl="{{{RESEND_UNSUBSCRIBE_URL}}}"
  />,
);

const payload = JSON.stringify({
  segment_id: process.env.RESEND_SEGMENT_ID,
  from: "Matt Lane <yo@mattlane.us>",
  subject: `New story! ${meta.title}`,
  html,
  send: true,
});

const res = await fetch("https://api.resend.com/broadcasts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: payload,
});

const data = await res.json();
if (!res.ok) {
  console.error("Resend error:", data);
  process.exit(1);
}
console.log("Broadcast sent:", data.id);
