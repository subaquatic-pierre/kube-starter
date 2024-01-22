import { useEffect, useState } from 'react';

// material-ui
import { Grid, Typography, Box } from '@mui/material';

// project imports
import Layout from 'layout';
import useAuth from 'hooks/useAuth';

import Page from 'components/Page';
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { useRouter } from 'next/router';

// ==============================|| Dashboard PAGE ||============================== //

const Dashboard = () => {
  return (
    <Layout admin>
      <Page title="Admin">
        <MainCard title="Sample Card">
          <Typography variant="body2">
            Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
            ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
            reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
            qui officiate descent molls anim id est labours.
          </Typography>
        </MainCard>
      </Page>
    </Layout>
  );
};

export default Dashboard;
