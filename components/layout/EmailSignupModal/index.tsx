"use client";

import { type FC, Suspense } from "react";
import EmailSignupModalInner from "./EmailSignupModalInner";

const EmailSignupModal: FC = () => (
  <Suspense fallback={null}>
    <EmailSignupModalInner />
  </Suspense>
);

export default EmailSignupModal;
