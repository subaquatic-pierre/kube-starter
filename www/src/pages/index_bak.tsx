import { ReactElement } from 'react';

// project import
import Layout from 'layouts';
import Page from 'components/Page';
import Landing from 'sections/landing';

export default function HomePage() {
  return (
    <Layout variant="guest">
      <Page title="Landing">
        <Landing />
      </Page>
    </Layout>
  );
}
