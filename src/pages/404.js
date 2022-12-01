import React from "react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="page">
      <h1 className="page-title">404: Page not found</h1>

      <p className="lead">
        Sorry, we've misplaced that URL or it's pointing to something that
        doesn't exist. <Link href="/">Head back home</Link> to try finding it
        again.
      </p>
    </div>
  );
}
