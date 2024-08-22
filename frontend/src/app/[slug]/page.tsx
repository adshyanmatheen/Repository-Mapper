'use client';

import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import CodeSnippet from '@/components/code-snippet';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';

const parseRepoData = (data: any[], prefix: string = '') => {
  let structure = '';

  data.forEach((item) => {
    if (item.type === 'dir') {
      structure += `${prefix}├── ${item.name}\n`;
      if (item.contents) {
        structure += parseRepoData(item.contents, prefix + '|   ');
      }
    } else {
      structure += `${prefix}|   ├── ${item.name}\n`;
    }
  });

  return structure;
};

const fuzzySearch = (query: string, structure: string) => {
  const lines = structure.split('\n');
  const lowerQuery = query.toLowerCase();

  return lines
    .filter((line) => {
      const lowerLine = line.toLowerCase();
      return lowerLine.includes(lowerQuery);
    })
    .join('\n');
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const [repoStructure, setRepoStructure] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStructure, setFilteredStructure] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const codeSnippetRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const loadingMessages = [
    "Hold on tight, we're chasing down your data... it’s a bit of a free spirit!",
    'Your data is in the oven... we’ll deliver it fresh and hot!',
    "Loading... we've sent our fastest electrons to fetch your info!",
    "Grabbing your data... it's in a bit of a traffic jam on the information superhighway.",
    "Your data is coming... it's just doing some stretches first.",
    'Hold up, we’re untangling the internet cables... almost there!',
    'Loading... because good things come to those who wait. And wait. And wait.',
    'Your data is en route... it insisted on taking the scenic route.',
    'Just a sec... we’re convincing your data to leave its comfy server.',
    "Loading... like a turtle racing a snail. But we'll get there!",
  ];

  const errorMessages = [
    'Uh-oh! Our servers are having a bit of a moment. Please try again!',
    "Looks like the data took a wrong turn. We're working on getting it back on track!",
    'Yikes! We hit a snag. Maybe give it another shot?',
    "Well, this is embarrassing... Let's pretend this never happened and try again.",
    'Our data elves are taking a break. Try refreshing the page!',
    "Hmmm, something's off. Could you try that again?",
    'The system had a hiccup. How about we give it another go?',
    "Oops! Our bad. We'll have this fixed in no time!",
    'Error 404: Sense of humor not found. Oh, and your data too. Try again?',
  ];

  const getRandomMessage = (messagesArray: any) => {
    const randomIndex = Math.floor(Math.random() * messagesArray.length);
    return messagesArray[randomIndex];
  };

  useEffect(() => {
    setLoadingMessage(getRandomMessage(loadingMessages));
    setErrorMessage(getRandomMessage(errorMessages));
  }, []);

  useEffect(() => {
    async function fetchGithubRepo() {
      try {
        setLoading(true);
        const response = await axios.post('/api/repo', {
          owner: owner,
          repoName: params.slug,
          token: session?.accessToken,
        });

        const respoData = response.data;
        const structure = parseRepoData(respoData);
        setRepoStructure(structure);
        setFilteredStructure(structure);
      } catch (error) {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchGithubRepo();
  }, [session, owner, params, errorMessage]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = fuzzySearch(searchQuery, repoStructure);
      setFilteredStructure(filtered);
    } else {
      setFilteredStructure(repoStructure);
    }
  }, [searchQuery, repoStructure]);

  useEffect(() => {
    if (codeSnippetRef.current) {
      gsap.fromTo(
        codeSnippetRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
      );
    }
  }, [filteredStructure]);

  useEffect(() => {
    if (loadingRef.current) {
      gsap.fromTo(
        loadingRef.current,
        { opacity: 1 },
        { opacity: 0.5, duration: 1.5, repeat: -1, yoyo: true },
      );
    }
  }, [loadingMessage]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div ref={loadingRef}>{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        {errorMessage}
      </div>
    );
  }

  return (
    <>
      <div className="mt-10">
        <Link href="/" className="flex flex-row items-center space-x-1.5">
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 duration-200"
          />
          <span className="text-lg">Back</span>
        </Link>
      </div>
      <div className="flex w-full flex-col py-8 space-y-6">
        <span className="font-bold text-xl">{params.slug}</span>

        <Input
          placeholder="Search Your Existing Codebase For Specific Files And Folders..."
          className="mb-8"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />

        <div
          className="w-full flex flex-col items-center justify-center sm:items-start"
          ref={codeSnippetRef}
        >
          <CodeSnippet
            code={filteredStructure}
            width="w-full"
            showCopyButton={!searchQuery.trim()}
          />
        </div>
      </div>
    </>
  );
}
