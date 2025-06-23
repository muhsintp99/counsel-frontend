import { Business, School, PlaylistAddCheck, Public } from '@mui/icons-material';

const icons = {
  Business,
  School,
  PlaylistAddCheck,
  Public
};

const colleges = {
  id: 'colleges',
  title: 'Colleges',
  type: 'group',
  children: [
    {
      id: 'international',
      title: 'International',
      type: 'collapse',
      icon: icons.Public,
      children: [
        {
          id: 'international-country',
          title: 'Country',
          type: 'item',
          url: '/international-colleges',
          icon: icons.Business,
          child: true
        },
        {
          id: 'international-intake',
          title: 'Intake',
          type: 'item',
          url: '/international-intake',
          icon: icons.PlaylistAddCheck,
          child: true
        },
        {
          id: 'international-course',
          title: 'Courses',
          type: 'item',
          url: '/international-course',
          icon: icons.School,
          child: true
        }
      ]
    },
    {
      id: 'domestic',
      title: 'Domestic',
      type: 'collapse',
      icon: icons.Public,
      children: [
        {
          id: 'domestic-state',
          title: 'State',
          type: 'item',
          url: '/domestic-colleges',
          icon: icons.Business,
          child: true
        },
        {
          id: 'domestic-intake',
          title: 'Intake',
          type: 'item',
          url: '/domestic-intake',
          icon: icons.PlaylistAddCheck,
          child: true
        },
        {
          id: 'domestic-course',
          title: 'Courses',
          type: 'item',
          url: '/domestic-course',
          icon: icons.School,
          child: true
        }
      ]
    }
  ]
};

export default colleges;
