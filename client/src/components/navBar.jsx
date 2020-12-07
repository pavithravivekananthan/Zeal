import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { logoutAction } from '../redux/actions/authActions';

const useStyles = makeStyles(() => ({
    appBar: {
        backgroundColor: '#AEC3BF',
        marginBottom: 11,
    },
    title: {
        flex: 1, marginLeft: 60, color: 'black', "&&&:before": {
            borderBottom: "none"
        },
        "&&:after": {
            borderBottom: "none"
        }
    },
    buttonStyles: {
        color: '#191919',
        margin: '0 6px 0',
        display: 'inline-block',
    },
    buttons: {
        marginRight: 55,
    },
    name: {
        fontStyle: 'bold',
        fontSize: 30,
    }
}));

export default function NavBar() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        account: { role },
        authenticated,
        firstName,
        lastName,
        address,
    } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutAction(history));
    };

    return (
        <AppBar position='static' className={classes.appBar}>
            <Toolbar>
                <Link to='/' className={classes.title}>
                    <Typography variant='h6' noWrap>
                        <span className={classes.name}>ZippyZeal</span>
                    </Typography>
                </Link>
                {authenticated ? (
                    role === 'SELLER' ? (
                        <div className={classes.buttons}>
                            <Typography className={classes.buttonStyles}>
                                Seller Dashboard
              </Typography>
                            <Link to='/seller/orders'>
                                <Button className={classes.buttonStyles}>Orders</Button>
                            </Link>
                            <Button
                                onClick={handleLogout}
                                className={classes.buttonStyles}
                                variant='outlined'
                            >
                                Logout
              </Button>
                        </div>
                    ) : (
                            <div className={classes.buttons}>
                                <Typography className={classes.buttonStyles}>
                                    Hello, {firstName} {lastName}
                                </Typography>
                                <Link to='/orders'>
                                    <Button className={classes.buttonStyles}>Orders</Button>
                                </Link>
                                <Link to={{ pathname: '/cart', state: { address: address } }}>
                                    <Button className={classes.buttonStyles}>Cart</Button>
                                </Link>
                                <Button
                                    onClick={handleLogout}
                                    className={classes.buttonStyles}
                                    variant='outlined'
                                >
                                    Logout
              </Button>
                            </div>
                        )
                ) : (
                        <div className={classes.buttons}>
                            <Link to='/addrestaurant'>
                                <Button className={classes.buttonStyles}>Seller</Button>
                            </Link>
                            <Link to='/login'>
                                <Button className={classes.buttonStyles}>Login</Button>
                            </Link>
                            <Link to='/register'>
                                <Button className={classes.buttonStyles}>
                                    Register
              </Button>
                            </Link>
                        </div>
                    )}
            </Toolbar>
        </AppBar>
    );
}
