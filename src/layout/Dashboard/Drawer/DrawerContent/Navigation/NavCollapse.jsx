import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';

// project imports
import NavItem from './NavItem';

// Ant Design Icons
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const NavCollapse = ({ menu, level, openCollapseId, setOpenCollapseId, drawerToggle }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization) || { borderRadius: 8 };
    const { pathname } = useLocation();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected((prevSelected) => (prevSelected === menu.id ? null : menu.id));
        setOpenCollapseId(open ? null : menu.id);
    };

    const checkOpenForParent = (child, id) => {
        child.forEach((item) => {
            if (item.url === pathname) {
                setOpen(true);
                setSelected(id);
            }
        });
    };

    useEffect(() => {
        setOpen(false);
        setSelected(null);
        if (menu.children) {
            menu.children.forEach((item) => {
                if (item.children?.length) {
                    checkOpenForParent(item.children, menu.id);
                }
                if (item.url === pathname) {
                    setSelected(menu.id);
                    setOpen(true);
                }
            });
        }
    }, [pathname, menu.children]);

    useEffect(() => {
        if (openCollapseId !== menu.id) {
            setOpen(false);
        }
    }, [openCollapseId]);

    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return (
                    <NavCollapse
                        key={item.id}
                        menu={item}
                        level={level + 1}
                        openCollapseId={openCollapseId}
                        setOpenCollapseId={setOpenCollapseId}
                        drawerToggle={drawerToggle}
                    />
                );
            case 'item':
                return (
                    <NavItem
                        key={item.id}
                        item={item}
                        level={level + 1}
                        isParents={true}
                        setSelectedID={setSelected}
                    />
                );
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;
    const menuIcon = Icon ? (
        <Icon style={{ fontSize: '1rem', marginTop: 'auto', marginBottom: 'auto' }} />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: selected === menu.id ? 6 : 6,
                height: selected === menu.id ? 6 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'inherit'}
        />
    );

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor:
                        selected === menu.id
                            ? theme.palette.primary.dark
                            : level > 1
                                ? 'transparent !important'
                                : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`
                }}
                selected={selected === menu.id}
                onClick={handleClick}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !Icon ? 18 : 36 }}>
                    {menuIcon}
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={selected === menu.id ? 'body1' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
                            {menu.title}
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography
                                variant="caption"
                                sx={{ ...theme.typography.subMenuCaption }}
                                display="block"
                                gutterBottom
                            >
                                {menu.caption}
                            </Typography>
                        )
                    }
                />
                {open ? (
                    <UpOutlined style={{ fontSize: '0.8rem', marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <DownOutlined style={{ fontSize: '0.8rem', marginTop: 'auto', marginBottom: 'auto' }} />
                )}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        '&:after': {
                            content: "''",
                            position: 'absolute',
                            left: '29px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            opacity: 1,
                            background: theme.palette.primary.light
                        }
                    }}
                >
                    {menus}
                </List>
            </Collapse>
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object.isRequired,
    level: PropTypes.number.isRequired,
    openCollapseId: PropTypes.string,
    setOpenCollapseId: PropTypes.func.isRequired,
    drawerToggle: PropTypes.func
};

export default NavCollapse;
