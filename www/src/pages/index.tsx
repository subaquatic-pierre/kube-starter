import Page from 'components/Page';
import { getSiteSettings } from 'lib/serverFetch';
import { SiteSettings } from 'models/settings';
import { GetStaticProps } from 'next';
import React from 'react';
import Logistics from 'views/Logistics';

interface PageProps {
  settings: SiteSettings;
}

const IndexPage: React.FC<PageProps> = ({ settings }): JSX.Element => {
  return (
    <Page settings={settings} title={settings.title}>
      <Logistics />
    </Page>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const settings = await getSiteSettings();

  return {
    props: {
      settings
    },
    revalidate: 10
  };
};
