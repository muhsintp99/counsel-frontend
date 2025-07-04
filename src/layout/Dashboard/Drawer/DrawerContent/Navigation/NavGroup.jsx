import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import { useGetMenuMaster } from 'api/menu';

export default function NavGroup({ item, drawerToggle }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // ✅ ADD THIS:
  const [openCollapseId, setOpenCollapseId] = useState(null);

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={menuItem.id}
            menu={menuItem}
            level={1}
            openCollapseId={openCollapseId}
            setOpenCollapseId={setOpenCollapseId}
            drawerToggle={drawerToggle}
          />
        );
      case 'item':
        return (
          <NavItem
            key={menuItem.id}
            item={menuItem}
            level={1}
            drawerToggle={drawerToggle}
          />
        );
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title && drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = {
  item: PropTypes.object,
  drawerToggle: PropTypes.func
};
