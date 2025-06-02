// assets
import { QuestionAnswer, Task } from '@mui/icons-material';

// icons
const icons = {
  QuestionAnswer,
  Task
};

// ==============================|| MENU ITEMS - enquiries ||============================== //

const enquiries = {
  id: 'enquiries',
  title: 'Enquiries',
  type: 'group',
  children: [
    {
      id: 'enquiries',
      title: 'Enquiries',
      type: 'item',
      url: '/enquiries',
      icon: icons.QuestionAnswer
    },
    {
      id: 'follow-up',
      title: 'Follow-up',
      type: 'item',
      url: '/follow-up',
      icon: icons.Task
    },

  ]
};

export default enquiries;
