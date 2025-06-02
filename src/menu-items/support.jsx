// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import { Groups, Public } from '@mui/icons-material';

// icons
const icons = {
  Groups,
  Public,
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'my-team',
      title: 'My Team',
      type: 'item',
      url: '/my-team',
      icon: icons.Groups
    },
    {
      id: 'country',
      title: 'Country',
      type: 'item',
      url: '/country',
      icon: icons.Public
    },
    {
      id: 'sample-page',
      title: 'Sample Page',
      type: 'item',
      url: '/sample-page',
      icon: icons.ChromeOutlined
    },
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
