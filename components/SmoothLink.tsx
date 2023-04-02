// SmoothLink.tsx
import React, { AnchorHTMLAttributes } from "react";

interface SmoothLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const SmoothLink: React.FC<SmoothLinkProps> = ({
  href,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default SmoothLink;
