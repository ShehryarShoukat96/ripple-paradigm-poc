import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { NavBarStyle } from './NavBar.style';

interface PropTypes extends WithStyles<typeof NavBarStyle> {
}

function NavBar({ classes }: PropTypes) {
  return (
    <div className={classes.navRoot}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Ripple POC
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(NavBarStyle, { withTheme: true })(NavBar);
