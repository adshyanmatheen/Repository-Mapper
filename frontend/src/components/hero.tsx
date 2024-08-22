'use client';

import React, { useEffect, useRef } from 'react';

import { Icon } from '@iconify/react';
import { gsap } from 'gsap';

import CodeSnippet from './code-snippet';
import { Button } from './ui/button';

export default function Hero() {
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const codeSnippetRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tl = gsap.timeline();

      tl.fromTo(
        [headingRef.current, textRef.current],
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.2,
        },
      )
        .fromTo(
          codeSnippetRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' },
          '-=0.2',
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)',
          },
        );
    }
  }, []);

  const popupCenter = (url: string) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      'OAuthSignIn',
      `width=${500 / systemZoom},height=${
        550 / systemZoom
      },top=${top},left=${left}`,
    );

    if (newWindow) newWindow.focus();
    else
      alert(
        'Failed to open the window, it may have been blocked by a popup blocker.',
      );
  };

  const code = `
├── public
|   |   ├── next.svg
|   |   ├── vercel.svg
├── src
|   ├── app
|   |   |   ├── favicon.ico
|   |   |   ├── globals.css
|   |   |   ├── layout.tsx
|   |   |   ├── page.tsx
|   ├── .eslintrc.json
|   ├── .gitignore
|   ├── bun.lockb
|   ├── next-env.d.ts
|   ├── next.config.mjs
|   ├── package.json
|   ├── postcss.config.mjs
|   ├── README.md
|   ├── tailwind.config.ts
|   ├── tsconfig.json
 `;

  return (
    <div className="flex flex-col space-y-6 space-x-0 md:space-y-0 md:flex-row md:space-x-2 md:justify-between mt-5 items-center">
      <div className="flex flex-col text-center text-balance items-center sm:text-start sm:items-start">
        <span ref={headingRef} className="text-2xl md:text-4xl font-bold">
          Visualise Your GitHub Repositories In ASCII
        </span>
        <span ref={textRef} className="text-neutral-700 text-lg mt-6">
          Code Sketch converts your existing GitHub repositories into clear
          ASCII diagrams, enhancing documentation and folder structure
          organisation understanding with an invaluable visualisation tool.
        </span>
        <div className="mt-2">
          <Button
            ref={buttonRef}
            onClick={() => popupCenter('/github-signin')}
            className="flex justify-center flex-row space-x-2 items-center mt-5"
          >
            <Icon icon="mdi:github" width="30" height="28" />
            <span> Connect To Get Started</span>
          </Button>
        </div>
      </div>
      <div
        ref={codeSnippetRef}
        className="w-full flex flex-col items-center justify-center sm:items-start"
      >
        <CodeSnippet code={code} width="w-[410px]" />
      </div>
    </div>
  );
}
