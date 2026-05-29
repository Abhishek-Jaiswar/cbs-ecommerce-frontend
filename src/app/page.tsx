"use client";

import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <Link href={"/products"}>products</Link>
    </div>
  );
};

export default page;
