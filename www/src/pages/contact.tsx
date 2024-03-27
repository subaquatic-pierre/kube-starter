import { ReactElement } from 'react';

// material-ui
import { Container, Grid } from '@mui/material';

// project imports
import Layout from 'layouts';
import Page from 'components/Page';
import ContactForm from 'sections/contact-us/ContactForm';
import ContactHeader from 'sections/contact-us/ContactHeader';

// ==============================|| CONTACT US - MAIN ||============================== //

const ContactUs = () => (
  <Layout variant="guest">
    <Page title="Contact Us">
      <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
        <Grid item xs={12}>
          <ContactHeader />
        </Grid>
        <Grid item xs={12} sm={10} lg={9}>
          <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
            <ContactForm />
          </Container>
        </Grid>
      </Grid>
    </Page>
  </Layout>
);

export default ContactUs;
