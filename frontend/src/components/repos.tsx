'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Repository } from '@/types/types';
import axios from 'axios';
import { gsap } from 'gsap';
import { Eye, GitFork, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

function PaginationSection({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const pageNumbers = Array.from(
    { length: Math.ceil(totalPosts / postsPerPage) },
    (_, i) => i + 1,
  );

  const maxPageNum = 5;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPages = () => {
    const renderedPages = activePages.map((page) => (
      <PaginationItem
        key={page}
        className={currentPage === page ? 'bg-neutral-100 rounded-md' : ''}
      >
        <PaginationLink onClick={() => setCurrentPage(page)}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />,
      );
    }

    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />,
      );
    }

    return renderedPages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevPage} />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext onClick={handleNextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const Repos = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4); // Updated to 4
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredRepos.slice(firstPostIndex, lastPostIndex);

  const highlightText = (text: string, highlight: string): JSX.Element => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index}>{part}</span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  useEffect(() => {
    const loadingMessages = [
      "Hold on tight, we're fetching your repositories... they’re on their way!",
      'Loading your repos... we’ve sent out the search party!',
      'Fetching repositories... our server is doing some heavy lifting!',
      "Hang tight! We're digging through the internet to get your repos.",
      "Gathering your repositories... they're almost here!",
      'Your repositories are on the way... just a little longer!',
      "Getting things ready... we're polishing your repositories!",
      'Your repos are coming... they’re just finding their way!',
      'Loading... like a snail racing a tortoise. Almost there!',
      "We’re fetching your repositories... it's a bit of a marathon!",
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

    const getRandomMessage = (messagesArray: string[]) => {
      const randomIndex = Math.floor(Math.random() * messagesArray.length);
      return messagesArray[randomIndex];
    };

    setLoadingMessage(getRandomMessage(loadingMessages));
    setErrorMessage(getRandomMessage(errorMessages));
  }, []);

  useEffect(() => {
    async function fetchAllGithubRepos() {
      setLoading(true);
      try {
        const response = await axios.post('/api/repos', {
          token: session?.accessToken,
        });
        setRepos(response.data);
        setFilteredRepos(response.data);
      } catch (error) {
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchAllGithubRepos();
    }
  }, [session, errorMessage]);

  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = repos.filter((repo) =>
      repo.name.toLowerCase().includes(searchTermLower),
    );
    setFilteredRepos(filtered);
  }, [repos, searchTerm]);

  useEffect(() => {
    const items = document.querySelectorAll('.repo-item');
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
      );
    });
  }, [currentPosts]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center pb-60">
        <div>{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center pb-60">
        <div>{errorMessage}</div>
      </div>
    );
  }

  return (
    <div>
      <Input
        placeholder="Search Your Existing GitHub Repositories..."
        className="mb-8"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-col pb-10">
        {currentPosts.map((repo) => (
          <div
            key={repo.id}
            className="repo-item flex flex-row justify-between items-center p-5 border rounded-lg mb-5"
          >
            <div className="flex flex-col space-y-1">
              <div className="font-medium">
                <Link href={`/${repo.name}?owner=${repo.owner.login}`}>
                  {highlightText(repo.name, searchTerm)}
                </Link>
                <span className="ml-2.5 text-xs border border-spacing-2 pl-2 pr-2 pt-0.5 pb-0.5 rounded-2xl text-slate-500 border-slate-500">
                  {capitalize(repo.visibility)}
                </span>
              </div>
              <div className="flex flex-row space-x-1 items-center text-sm">
                <Star size={14} fill="yellow" />
                <span className="pr-2.5">{repo.stargazers_count}</span>
                <GitFork size={14} />
                <span className="pr-2.5">{repo.forks_count}</span>
                <Eye size={14} fill="lightblue" />
                <span>{repo.watchers_count}</span>
              </div>
            </div>

            <Button asChild>
              <Link href={`/${repo.name}?owner=${repo.owner.login}`}>
                View Repository
              </Link>
            </Button>
          </div>
        ))}
      </div>
      <PaginationSection
        totalPosts={filteredRepos.length}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Repos;
