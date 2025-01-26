"use client";

import React, { useEffect, useState } from "react";

function ClientOnly({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : null;
}

export default ClientOnly;
