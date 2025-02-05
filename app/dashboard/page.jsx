import MainContent from '@/Components/MainContent';
import React, { Suspense } from 'react';

const Content = () => {
    return (
        <MainContent />
    );
}

const page = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <Content />
    </Suspense>
  )
}

export default page;
