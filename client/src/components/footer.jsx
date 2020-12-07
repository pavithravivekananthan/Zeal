import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#e8ede1',
    height: '10vh',
    textAlign: 'center',
    marginTop: 195
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
  }
}));
export default function Footer() {
  const classes = useStyles();
  return (

    <Grid container justify='center' alignItems='center' className={classes.container}>
      <Box justifyContent="flex-end" alignContent="flex-end">All rights are reserved @2020</Box>
    </Grid>

    // <footer className={classes.footer} alignItems='center'>
    //   <Paper className={classes.root} elevation={1}>
    //     <Typography component="p" justify='center'>
    //       @2020 All right reserved
    //     </Typography>
    //   </Paper>
    // </footer>
  );
}

