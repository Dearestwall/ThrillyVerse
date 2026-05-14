// src/components/seo/StructuredData.tsx - FIXED STRUCTURED DATA
import React from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Article' | 'Course' | 'Quiz';
  data: {
    [key: string]: string | number | boolean | object | undefined;
  };
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Organization Schema
export function OrganizationSchema() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: 'ThrillyVerse',
        url: 'https://thrillyverse.com',
        logo: 'https://thrillyverse.com/logo.png',
        description: 'Educational platform for ICSE and ISC students',
        sameAs: [
          'https://www.instagram.com/thrillyverse',
          'https://www.youtube.com/@ThrillyVerse',
          'https://t.me/icseverse',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'thrillyverse@gmail.com',
          contactType: 'Customer Service',
        },
      }}
    />
  );
}

// Website Schema
export function WebsiteSchema() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        name: 'ThrillyVerse',
        url: 'https://thrillyverse.com',
        description: 'Think Beyond The Verse - Educational Platform',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://thrillyverse.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}